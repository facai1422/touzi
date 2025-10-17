'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface RechargeRecord {
  id: number;
  amount: number;
  payment_method: string;
  payment_account: string;
  order_no: string;
  status: string;
  completed_at: string;
  created_at: string;
}

interface WithdrawRecord {
  id: number;
  amount: number;
  fee: number;
  actual_amount: number;
  bank_name: string;
  bank_account: string;
  account_name: string;
  order_no: string;
  status: string;
  processed_at: string;
  completed_at: string;
  created_at: string;
}

interface InvestmentRecord {
  id: number;
  project_name: string;
  amount: number;
  expected_return: number;
  actual_return: number;
  start_date: string;
  end_date: string;
  status: string;
  interest_rate: number;
  created_at: string;
}

interface IncomeRecord {
  id: number;
  amount: number;
  source: string;
  status: string;
  created_at: string;
}

// 获取类型文本
const getTypeText = (type: number) => {
  switch (type) {
    case 1: return '充值';
    case 2: return '提现';
    case 3: return '投资';
    case 4: return '收益';
    default: return '未知';
  }
};

export default function FinancePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'recharge' | 'withdraw' | 'investment' | 'income'>('recharge');
  const [rechargeRecords, setRechargeRecords] = useState<RechargeRecord[]>([]);
  const [withdrawRecords, setWithdrawRecords] = useState<WithdrawRecord[]>([]);
  const [investmentRecords, setInvestmentRecords] = useState<InvestmentRecord[]>([]);
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 检查认证状态
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [loading, isAuthenticated, router]);

  // 获取财务数据
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchFinanceData = async () => {
      try {
        setIsLoading(true);

        // 获取充值记录
        const { data: rechargeData, error: rechargeError } = await supabase
          .from('recharge_records')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (rechargeError) {
          console.error('获取充值记录失败:', rechargeError);
        } else {
          setRechargeRecords(rechargeData || []);
        }

        // 获取提现记录
        const { data: withdrawData, error: withdrawError } = await supabase
          .from('withdraw_records')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (withdrawError) {
          console.error('获取提现记录失败:', withdrawError);
        } else {
          setWithdrawRecords(withdrawData || []);
        }

        // 获取投资记录
        const { data: investmentData, error: investmentError } = await supabase
          .from('user_investments')
          .select(`
            *,
            investment_projects (
              name,
              interest_rate
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (investmentError) {
          console.error('获取投资记录失败:', investmentError);
        } else {
          const formattedInvestments = investmentData?.map(inv => ({
            id: inv.id,
            project_name: inv.investment_projects?.name || '未知项目',
            amount: inv.amount,
            expected_return: inv.expected_return,
            actual_return: inv.actual_return,
            start_date: inv.start_date,
            end_date: inv.end_date,
            status: inv.status,
            interest_rate: inv.investment_projects?.interest_rate || 0,
            created_at: inv.created_at
          })) || [];
          setInvestmentRecords(formattedInvestments);
        }

        // 获取收益记录（从资金流水中筛选收益类型）
        const { data: incomeData, error: incomeError } = await supabase
          .from('finance_transactions')
          .select('*')
          .eq('user_id', user.id)
          .eq('transaction_type', 'income')
          .order('created_at', { ascending: false });

        if (incomeError) {
          console.error('获取收益记录失败:', incomeError);
        } else {
          const formattedIncome = incomeData?.map(income => ({
            id: income.id,
            amount: income.amount,
            source: income.description || '投资收益',
            status: income.status,
            created_at: income.created_at
          })) || [];
          setIncomeRecords(formattedIncome);
        }

      } catch (error) {
        console.error('获取财务数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinanceData();
  }, [isAuthenticated, user]);

  // 如果正在加载或未认证，显示加载状态
  if (loading || !isAuthenticated || isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #ef4444',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>正在加载财务数据...</p>
        </div>
      </div>
    );
  }

  // 格式化金额显示
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取状态显示文字
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': '待处理',
      'completed': '成功',
      'failed': '失败',
      'cancelled': '已取消',
      'active': '进行中',
      'settled': '已结算'
    };
    return statusMap[status] || status;
  };

  // 获取当前标签页的数据
  const getCurrentData = () => {
    switch (activeTab) {
      case 'recharge':
        return rechargeRecords;
      case 'withdraw':
        return withdrawRecords;
      case 'investment':
        return investmentRecords;
      case 'income':
        return incomeRecords;
      default:
        return [];
    }
  };

  // 渲染记录项
  const renderRecordItem = (record: RechargeRecord | WithdrawRecord | InvestmentRecord | IncomeRecord, index: number) => {
    const isRecharge = activeTab === 'recharge';
    const isWithdraw = activeTab === 'withdraw';
    const isInvestment = activeTab === 'investment';
    const isIncome = activeTab === 'income';

    return (
      <div key={record.id || index} style={{
        background: '#fff',
        margin: '0.5rem 1rem',
        borderRadius: '0.5rem',
        padding: '1rem',
        boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '1rem',
            fontWeight: 500,
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            {isRecharge && '充值'}
            {isWithdraw && '提款'}
            {isInvestment && '投资'}
            {isIncome && '收益'}
          </div>
          <div style={{
            background: '#10b981',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            display: 'inline-block'
          }}>
            类型: {getTypeText((record as any).type || 1)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            background: isRecharge || isIncome ? '#ef4444' : '#10b981',
            color: 'white',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '0.5rem'
          }}>
            {isRecharge && '+'}
            {isWithdraw && '-'}
            {isInvestment && '-'}
            {isIncome && '+'}
            {formatAmount((record as any).money || (record as any).amount || 0)}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            {formatDate(record.created_at)}
          </div>
        </div>
      </div>
    );
  };

  const currentData = getCurrentData();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 顶部导航 */}
      <div style={{
        background: '#ef4444',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}>
        <Link href="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>资金明细</h1>
      </div>

      {/* 标签页导航 */}
      <div style={{
        background: '#fff',
        display: 'flex',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <button
          onClick={() => window.open('https://chat2.boltcode.vip?visiter_id=&visiter_name=&avatar=&business_id=1&groupid=0&special=1', '_blank')}
          style={{
            flex: 1,
            padding: '1rem',
            border: 'none',
            background: 'transparent',
            color: '#ef4444',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            borderBottom: '2px solid #ef4444'
          }}
        >
          充值
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          style={{
            flex: 1,
            padding: '1rem',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'withdraw' ? '#ef4444' : '#6b7280',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            borderBottom: activeTab === 'withdraw' ? '2px solid #ef4444' : '2px solid transparent'
          }}
        >
          提款
        </button>
        <button
          onClick={() => setActiveTab('investment')}
          style={{
            flex: 1,
            padding: '1rem',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'investment' ? '#ef4444' : '#6b7280',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            borderBottom: activeTab === 'investment' ? '2px solid #ef4444' : '2px solid transparent'
          }}
        >
          投资
        </button>
        <button
          onClick={() => setActiveTab('income')}
          style={{
            flex: 1,
            padding: '1rem',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'income' ? '#ef4444' : '#6b7280',
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            borderBottom: activeTab === 'income' ? '2px solid #ef4444' : '2px solid transparent'
          }}
        >
          收益
        </button>
      </div>

      {/* 内容区域 */}
      <div style={{ paddingBottom: '2rem' }}>
        {currentData.length === 0 ? (
          <div style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '1rem'
          }}>
            没有更多了
          </div>
        ) : (
          currentData.map((record, index) => renderRecordItem(record, index))
        )}
      </div>
    </div>
  );
}
