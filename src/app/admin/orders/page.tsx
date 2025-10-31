'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminGlassLayout from '@/components/ui/admin-glass-layout';
import { formatBeijingTime } from '@/utils/timeUtils';

interface Investment {
  id: number;
  user_id: number;
  project_id: number;
  amount: number;
  expected_return: number;
  actual_return: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  users: {
    phone: string;
    name: string | null;
    real_name: string | null;
  };
  investment_projects: {
    name: string;
    interest_rate: number;
    duration_days: number;
  }[];
}

export default function OrdersPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

  useEffect(() => {
    loadInvestments();
    
    // 自动处理到期订单
    const processMaturedInvestments = async () => {
      try {
        const now = new Date();
        
        // 查找已到期但状态还是 active 的投资
        const { data: maturedInvestments, error: fetchError } = await supabase
          .from('user_investments')
          .select('*')
          .eq('status', 'active')
          .lte('end_date', now.toISOString());

        if (fetchError) {
          console.error('获取到期投资失败:', fetchError);
          return;
        }

        if (maturedInvestments && maturedInvestments.length > 0) {
          console.log(`发现 ${maturedInvestments.length} 个到期订单，正在处理...`);
          
          // 批量更新到期订单状态
          for (const investment of maturedInvestments) {
            // 更新 user_investments 状态
            await supabase
              .from('user_investments')
              .update({ 
                status: 'completed',
                actual_return: Number(investment.expected_return)
              })
              .eq('id', investment.id);

            // 更新 investment_contracts 状态
            await supabase
              .from('investment_contracts')
              .update({ 
                contract_status: 'completed'
              })
              .eq('investment_id', investment.id);

            // 更新用户余额
            const { data: userData } = await supabase
              .from('users')
              .select('money')
              .eq('id', investment.user_id)
              .single();

            if (userData) {
              const newBalance = Number(userData.money) + Number(investment.amount) + Number(investment.expected_return);
              
              await supabase
                .from('users')
                .update({ money: newBalance.toString() })
                .eq('id', investment.user_id);

              // 创建财务记录
              await supabase
                .from('finance_transactions')
                .insert({
                  user_id: investment.user_id,
                  transaction_type: 'income',
                  amount: Number(investment.amount) + Number(investment.expected_return),
                  balance_before: Number(userData.money),
                  balance_after: newBalance,
                  description: `投资到期结算 - 本金+收益`,
                  created_at: new Date().toISOString()
                });
            }
          }
          
          // 重新加载订单列表
          loadInvestments();
        }
      } catch (error) {
        console.error('处理到期订单失败:', error);
      }
    };

    // 立即执行一次
    processMaturedInvestments();
    
    // 每30秒检查一次
    const interval = setInterval(processMaturedInvestments, 30000);
    
    return () => clearInterval(interval);
  }, [filter]);

  const loadInvestments = async () => {
    try {
      setLoading(true);
      
      // 先获取投资订单
      let query = supabase
        .from('user_investments')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data: investmentsData, error: investmentsError } = await query;

      if (investmentsError) {
        console.error('获取投资订单失败:', investmentsError);
        return;
      }

      // 手动关联查询用户和产品信息
      const enrichedData = await Promise.all(
        (investmentsData || []).map(async (investment) => {
          // 获取用户信息
          const { data: userData } = await supabase
            .from('users')
            .select('phone, name, real_name')
            .eq('id', investment.user_id)
            .single();

          // 获取产品信息
          const { data: projectData } = await supabase
            .from('investment_projects')
            .select('name, interest_rate, duration_days')
            .eq('id', investment.project_id)
            .single();

          return {
            ...investment,
            users: userData || { phone: '', name: null, real_name: null },
            investment_projects: projectData ? [projectData] : []
          };
        })
      );

      setInvestments(enrichedData);
    } catch (error) {
      console.error('获取投资订单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (investment: Investment) => {
    setSelectedInvestment(investment);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (investmentId: number, newStatus: string) => {
    try {
      const investment = investments.find(i => i.id === investmentId);
      if (!investment) {
        alert('未找到该订单');
        return;
      }

      // 如果设置为已完成，需要结算本金和利息到用户账户
      if (newStatus === 'completed') {
        // 1. 获取用户当前余额
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('money, pending_principal, pending_interest')
          .eq('id', investment.user_id)
          .single();

        if (fetchError) {
          alert('获取用户信息失败');
          return;
        }

        const currentBalance = Number(userData.money);
        const settlementAmount = Number(investment.amount) + Number(investment.expected_return);
        const newBalance = currentBalance + settlementAmount;

        // 2. 更新用户余额（清除待收金额）
        const { error: updateBalanceError } = await supabase
          .from('users')
          .update({
            money: newBalance.toString(),
            pending_principal: 0,
            pending_interest: 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', investment.user_id);

        if (updateBalanceError) {
          console.error('更新用户余额失败:', updateBalanceError);
          alert('更新用户余额失败');
          return;
        }

        // 3. 创建财务流水记录
        const { error: transactionError } = await supabase
          .from('finance_transactions')
          .insert({
            user_id: investment.user_id,
            transaction_type: 'investment_return',
            amount: settlementAmount,
            balance_before: currentBalance,
            balance_after: newBalance,
            status: 'completed',
            description: `投资结算：本金${investment.amount}+利息${investment.expected_return}（管理员手动结算）`,
            created_at: new Date().toISOString()
          });

        if (transactionError) {
          console.error('创建财务流水失败:', transactionError);
          // 不阻止订单状态更新，只记录错误
        }
      }

      // 4. 更新订单状态
      const { error } = await supabase
        .from('user_investments')
        .update({ 
          status: newStatus,
          actual_return: newStatus === 'completed' ? investment.expected_return : 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', investmentId);

      if (error) {
        console.error('更新订单状态失败:', error);
        alert('更新订单状态失败');
        return;
      }

      alert(newStatus === 'completed' ? '订单已完成并已结算到用户账户' : '订单状态更新成功');
      loadInvestments();
    } catch (error) {
      console.error('更新订单状态失败:', error);
      alert('更新订单状态失败');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">进行中</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs">已完成</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">已取消</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">{status}</span>;
    }
  };

  const totalAmount = investments.reduce((sum, i) => sum + i.amount, 0);
  const totalExpectedReturn = investments.reduce((sum, i) => sum + i.expected_return, 0);

  return (
    <AdminGlassLayout activePage="orders">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">订单管理</h1>
          <p className="text-gray-400 mt-2">管理系统中的所有投资订单</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="content-card">
            <p className="text-sm text-gray-400">总订单数</p>
            <p className="text-3xl font-bold text-indigo-400 mt-2">{investments.length}</p>
          </div>
          <div className="content-card">
            <p className="text-sm text-gray-400">进行中</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">
              {investments.filter(i => i.status === 'active').length}
            </p>
          </div>
          <div className="content-card">
            <p className="text-sm text-gray-400">已完成</p>
            <p className="text-3xl font-bold text-pink-400 mt-2">
              {investments.filter(i => i.status === 'completed').length}
            </p>
          </div>
          <div className="content-card">
            <p className="text-sm text-gray-400">总投资金额</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">
              ¥{totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="content-card">
            <p className="text-sm text-gray-400">总预期收益</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">
              ¥{totalExpectedReturn.toLocaleString()}
            </p>
          </div>
      </div>

        {/* 筛选器 */}
        <div className="content-card">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              全部订单
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'active' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              进行中
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              已完成
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'cancelled' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              已取消
            </button>
        </div>
      </div>

      {/* 订单列表 */}
        <div className="content-card">
        {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div style={{
                  border: '3px solid rgba(99, 102, 241, 0.3)',
                  borderTop: '3px solid #6366f1',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                <p className="text-gray-400">加载中...</p>
              </div>
            </div>
          ) : investments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">暂无订单数据</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">订单ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">用户信息</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">产品名称</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">投资金额</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">收益率</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">预期收益</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">状态</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">创建时间</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment) => (
                    <tr key={investment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-white">#{investment.id}</td>
                      <td className="px-4 py-3 text-sm text-white">
                        <div>
                          <p className="font-medium">{investment.users?.real_name || investment.users?.name || '未设置'}</p>
                          <p className="text-xs text-gray-400">{investment.users?.phone}</p>
              </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        <div>
                          <p className="font-medium">{investment.investment_projects?.[0]?.name || '未知产品'}</p>
                          <p className="text-xs text-gray-400">
                            期限: {investment.investment_projects?.[0]?.duration_days || 0}天
                          </p>
                    </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-white font-semibold">
                        ¥{investment.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-cyan-400 font-semibold">
                        {investment.investment_projects?.[0]?.interest_rate || 0}%
                      </td>
                      <td className="px-4 py-3 text-sm text-emerald-400 font-semibold">
                        ¥{investment.expected_return.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getStatusBadge(investment.status)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {formatBeijingTime(investment.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleViewDetail(investment)}
                          className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30 transition-colors text-xs"
                        >
                          详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                </div>
              )}
            </div>
      </div>

      {/* 订单详情模态框 */}
      {showDetailModal && selectedInvestment && (
        <OrderDetailModal
          investment={selectedInvestment}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedInvestment(null);
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* 动画样式 */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AdminGlassLayout>
  );
}

interface OrderDetailModalProps {
  investment: Investment;
  onClose: () => void;
  onUpdateStatus: (id: number, status: string) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ investment, onClose, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState(investment.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus !== investment.status) {
      onUpdateStatus(investment.id, newStatus);
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="content-card" style={{
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* 标题栏 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: 'white',
            margin: 0
          }}>
            订单详情 #{investment.id}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 用户信息 */}
            <div>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: 'white', 
                marginBottom: '16px' 
              }}>
                用户信息
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px'
              }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>用户姓名</p>
                  <p style={{ fontSize: '14px', color: 'white', marginTop: '4px' }}>
                    {investment.users?.real_name || investment.users?.name || '未设置'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>手机号</p>
                  <p style={{ fontSize: '14px', color: 'white', marginTop: '4px' }}>
                    {investment.users?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* 产品信息 */}
            <div>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: 'white', 
                marginBottom: '16px' 
              }}>
                产品信息
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px'
              }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>产品名称</p>
                  <p style={{ fontSize: '14px', color: 'white', marginTop: '4px' }}>
                    {investment.investment_projects?.[0]?.name || '未知产品'}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>日收益率</p>
                  <p style={{ fontSize: '14px', color: '#10b981', marginTop: '4px' }}>
                    {investment.investment_projects?.[0]?.interest_rate || 0}%
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>投资期限</p>
                  <p style={{ fontSize: '14px', color: 'white', marginTop: '4px' }}>
                    {investment.investment_projects?.[0]?.duration_days || 0}天
                  </p>
                </div>
              </div>
            </div>

            {/* 订单信息 */}
            <div>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: 'white', 
                marginBottom: '16px' 
              }}>
                订单信息
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px'
              }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>投资金额</p>
                  <p style={{ fontSize: '14px', color: '#fbbf24', marginTop: '4px', fontWeight: '600' }}>
                    ¥{investment.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>预期收益</p>
                  <p style={{ fontSize: '14px', color: '#10b981', marginTop: '4px', fontWeight: '600' }}>
                    ¥{investment.expected_return.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>开始日期</p>
                  <p style={{ fontSize: '14px', color: 'white', marginTop: '4px' }}>
                    {formatBeijingTime(investment.start_date)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>结束日期</p>
                  <p style={{ fontSize: '14px', color: 'white', marginTop: '4px' }}>
                    {formatBeijingTime(investment.end_date)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>创建时间</p>
                  <p style={{ fontSize: '14px', color: 'white', marginTop: '4px' }}>
                    {formatBeijingTime(investment.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* 状态管理 */}
            <div>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: 'white', 
                marginBottom: '16px' 
              }}>
                订单状态
              </h4>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="active" style={{ background: '#1e293b', color: 'white' }}>进行中</option>
                <option value="completed" style={{ background: '#1e293b', color: 'white' }}>已完成</option>
                <option value="cancelled" style={{ background: '#1e293b', color: 'white' }}>已取消</option>
              </select>
            </div>
          </div>

          {/* 按钮组 */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              关闭
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              保存修改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
