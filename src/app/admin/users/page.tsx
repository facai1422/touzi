'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminGlassLayout from '@/components/ui/admin-glass-layout';

interface User {
  id: number;
  phone: string;
  name?: string;
  money: number;
  member_level: number;
  auth: number;
  created_at: string;
  last_login_time?: string;
  is_online: boolean;
  clock: number;
  invite_code?: string;
}

// 余额调整模态框组件
interface BalanceModalProps {
  user: User;
  onSave: (amount: number, type: 'add' | 'subtract', description: string) => void;
  onCancel: () => void;
}

const BalanceModal: React.FC<BalanceModalProps> = ({ user, onSave, onCancel }) => {
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'add' | 'subtract'>('add');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('请输入有效金额');
      return;
    }
    onSave(amount, type, description);
  };

  const currentBalance = Number(user.money);
  const newBalance = type === 'add' ? currentBalance + amount : currentBalance - amount;

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
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* 标题栏 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: 'white',
            margin: 0
          }}>
            调整用户余额
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 用户信息 */}
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>用户手机号</span>
                <span style={{ fontSize: '14px', color: 'white' }}>{user.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>当前余额</span>
                <span style={{ fontSize: '16px', color: '#10b981', fontWeight: '600' }}>
                  ¥{currentBalance.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 调整类型 */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '8px'
              }}>
                调整类型
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setType('add')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: type === 'add' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.05)',
                    border: type === 'add' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  💰 增加余额
                </button>
                <button
                  type="button"
                  onClick={() => setType('subtract')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: type === 'subtract' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'rgba(255, 255, 255, 0.05)',
                    border: type === 'subtract' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  💸 扣减余额
                </button>
              </div>
            </div>

            {/* 调整金额 */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '6px'
              }}>
                调整金额(元)
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="请输入调整金额"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              />
            </div>

            {/* 调整说明 */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '6px'
              }}>
                调整说明
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请输入调整原因（可选）"
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* 结果预览 */}
            {amount > 0 && (
              <div style={{
                padding: '12px',
                background: type === 'add' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${type === 'add' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>调整后余额</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: '700',
                      color: newBalance >= 0 ? '#10b981' : '#ef4444'
                    }}>
                      ¥{newBalance.toLocaleString()}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: type === 'add' ? '#10b981' : '#ef4444',
                      marginTop: '2px'
                    }}>
                      {type === 'add' ? '+' : '-'}¥{amount.toLocaleString()}
                    </div>
                  </div>
                </div>
                {newBalance < 0 && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#ef4444'
                  }}>
                    ⚠️ 警告：余额不足，无法扣减此金额
                  </div>
                )}
              </div>
            )}
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
              onClick={onCancel}
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
              取消
            </button>
            <button
              type="submit"
              disabled={amount <= 0 || newBalance < 0}
              style={{
                flex: 1,
                padding: '10px 20px',
                background: (amount <= 0 || newBalance < 0) 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: (amount <= 0 || newBalance < 0) ? 'not-allowed' : 'pointer',
                opacity: (amount <= 0 || newBalance < 0) ? 0.5 : 1
              }}
            >
              确认调整
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 编辑用户模态框组件
interface EditUserModalProps {
  user: User;
  onSave: (updatedUser: any) => void;
  onCancel: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    phone: user.phone || '',
    usdt_address: '',
    name: user.name || '',
    id_card: '',
    bank_name: '',
    bank_card: '',
    auth: user.auth || 0,
    invite_status: 0,
    account_status: user.clock || 0
  });
  const [loading, setLoading] = useState(true);

  // 获取用户的完整信息
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        
        // 1. 先从users表获取基本信息
        const { data: userData } = await supabase
          .from('users')
          .select('real_name, idcard')
          .eq('id', user.id)
          .single();

        // 2. 获取实名认证信息（优先使用认证表的信息）
        const { data: verificationData } = await supabase
          .from('user_verifications')
          .select('real_name, id_card')
          .eq('user_id', user.id)
          .eq('status', 1)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // 3. 获取银行卡信息
        const { data: bankCardData } = await supabase
          .from('bank_cards')
          .select('bank_name, card_number, cardholder_name')
          .eq('user_id', user.id)
          .eq('is_default', true)
          .maybeSingle();

        // 4. 获取USDT地址
        const { data: usdtData } = await supabase
          .from('usdt_addresses')
          .select('address')
          .eq('user_id', user.id)
          .eq('is_default', true)
          .maybeSingle();

        // 更新表单数据（优先使用认证表的数据，如果没有则使用users表的数据）
        setFormData(prev => ({
          ...prev,
          name: verificationData?.real_name || userData?.real_name || user.name || '',
          id_card: verificationData?.id_card || userData?.idcard || '',
          bank_name: bankCardData?.bank_name || '',
          bank_card: bankCardData?.card_number || '',
          usdt_address: usdtData?.address || ''
        }));

      } catch (error) {
        console.error('获取用户详细信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user.id, user.name, user.auth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'auth' || name === 'invite_status' || name === 'account_status'
        ? Number(value)
        : value
    }));
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
            修改会员
          </h3>
          <button 
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
              lineHeight: 1,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {loading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              color: '#9ca3af'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  border: '3px solid rgba(99, 102, 241, 0.3)',
                  borderTop: '3px solid #6366f1',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px'
                }}></div>
                <p>加载用户信息中...</p>
              </div>
            </div>
          ) : (
            <>
          {/* 基本信息 */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#818cf8', 
              marginBottom: '16px' 
            }}>
              基本信息
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#d1d5db', 
                  marginBottom: '8px' 
                }}>
                  手机号码 <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="输入手机号码"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#818cf8'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#d1d5db', 
                  marginBottom: '8px' 
                }}>
                  姓名
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="输入姓名"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#818cf8'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#d1d5db', 
                  marginBottom: '8px' 
                }}>
                  身份证号
                </label>
                <input
                  type="text"
                  name="id_card"
                  value={formData.id_card}
                  onChange={handleChange}
                  placeholder="输入身份证号"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#818cf8'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>
            </div>
          </div>

          {/* 财务信息 */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#818cf8', 
              marginBottom: '16px' 
            }}>
              财务信息
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#d1d5db', 
                  marginBottom: '8px' 
                }}>
                  USDT地址
                </label>
                <input
                  type="text"
                  name="usdt_address"
                  value={formData.usdt_address}
                  onChange={handleChange}
                  placeholder="输入USDT地址"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#818cf8'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#d1d5db', 
                  marginBottom: '8px' 
                }}>
                  银行名称
                </label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  placeholder="输入银行名称"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#818cf8'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#d1d5db', 
                  marginBottom: '8px' 
                }}>
                  银行卡号
                </label>
                <input
                  type="text"
                  name="bank_card"
                  value={formData.bank_card}
                  onChange={handleChange}
                  placeholder="输入银行卡号"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#818cf8'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
              </div>
            </div>
          </div>

          {/* 账户设置 */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#818cf8', 
              marginBottom: '16px' 
            }}>
              账户设置
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#d1d5db', 
                  marginBottom: '8px' 
                }}>
                  实名认证
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    <input
                      type="radio"
                      name="auth"
                      value={1}
                      checked={formData.auth === 1}
                      onChange={handleChange}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    是
                  </label>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    <input
                      type="radio"
                      name="auth"
                      value={0}
                      checked={formData.auth === 0}
                      onChange={handleChange}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    否
                  </label>
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#d1d5db', 
                  marginBottom: '8px' 
                }}>
                  邀请权限
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    <input
                      type="radio"
                      name="invite_status"
                      value={1}
                      checked={formData.invite_status === 1}
                      onChange={handleChange}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    允许
                  </label>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    <input
                      type="radio"
                      name="invite_status"
                      value={0}
                      checked={formData.invite_status === 0}
                      onChange={handleChange}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    禁止
                  </label>
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#d1d5db', 
                  marginBottom: '8px' 
                }}>
                  账户状态
                </label>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    <input
                      type="radio"
                      name="account_status"
                      value={0}
                      checked={formData.account_status === 0}
                      onChange={handleChange}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    正常
                  </label>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    <input
                      type="radio"
                      name="account_status"
                      value={1}
                      checked={formData.account_status === 1}
                      onChange={handleChange}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    关闭
                  </label>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    <input
                      type="radio"
                      name="account_status"
                      value={2}
                      checked={formData.account_status === 2}
                      onChange={handleChange}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    冻结
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '10px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              关闭
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px 24px',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#4f46e5'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#6366f1'}
            >
              提交
            </button>
          </div>
            </>
          )}
        </form>
      </div>
      
      {/* 动画样式 */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// 生成邀请码函数
const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);  // 新增：余额调整模态框
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('获取用户列表失败:', error);
        return;
      }

      const usersWithStatus = (data || []).map(user => ({
        ...user,
        last_login_time: user.last_login_time || new Date().toISOString(),
        is_online: Math.random() > 0.5
      }));

      setUsers(usersWithStatus);
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleAdjustBalance = (user: User) => {
    setEditingUser(user);
    setShowBalanceModal(true);
  };

  // 生成用户邀请码
  const handleGenerateInviteCode = async (user: User) => {
    try {
      const newInviteCode = generateInviteCode();
      
      const { error } = await supabase
        .from('users')
        .update({ invite_code: newInviteCode })
        .eq('id', user.id);

      if (error) {
        alert('生成邀请码失败');
        return;
      }

      alert(`邀请码生成成功: ${newInviteCode}`);
      loadUsers();
    } catch (error) {
      console.error('生成邀请码失败:', error);
      alert('生成邀请码失败');
    }
  };

  const handleSaveBalance = async (amount: number, type: 'add' | 'subtract', description: string) => {
    if (!editingUser) return;

    try {
      // 获取当前用户余额
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('money')
        .eq('id', editingUser.id)
        .single();

      if (fetchError || !userData) {
        alert('获取用户信息失败');
        return;
      }

      const currentBalance = Number(userData.money);
      const adjustAmount = type === 'add' ? amount : -amount;
      const newBalance = currentBalance + adjustAmount;

      // 检查余额是否足够
      if (newBalance < 0) {
        alert('余额不足，无法扣减');
        return;
      }

      // 更新用户余额
      const { error: updateError } = await supabase
        .from('users')
        .update({ money: newBalance.toString() })
        .eq('id', editingUser.id);

      if (updateError) {
        alert('更新余额失败');
        return;
      }

      // 创建财务记录
      await supabase
        .from('finance_transactions')
        .insert({
          user_id: editingUser.id,
          transaction_type: type === 'add' ? 'recharge' : 'withdraw',
          amount: adjustAmount,
          balance_before: currentBalance,
          balance_after: newBalance,
          description: description || (type === 'add' ? '管理员充值' : '管理员扣减'),
          created_at: new Date().toISOString()
        });

      alert('余额调整成功');
      setShowBalanceModal(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('调整余额失败:', error);
      alert('调整余额失败');
    }
  };

  const handleSaveUser = async (updatedUser: any) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updatedUser.name,
          phone: updatedUser.phone,
          auth: updatedUser.auth,
          clock: updatedUser.account_status
        })
        .eq('id', editingUser?.id);

      if (error) {
        console.error('更新用户信息失败:', error);
        return;
      }

      setShowEditModal(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error('更新用户信息失败:', error);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
  };

  return (
    <AdminGlassLayout activePage="users">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">用户管理</h1>
          <p className="text-gray-400 mt-2">管理系统中的所有用户</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="content-card">
            <p className="text-sm text-gray-400">总用户数</p>
            <p className="text-3xl font-bold text-indigo-400 mt-2">{users.length}</p>
          </div>
          <div className="content-card">
            <p className="text-sm text-gray-400">在线用户</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">
              {users.filter(u => u.is_online).length}
            </p>
          </div>
          <div className="content-card">
            <p className="text-sm text-gray-400">已认证用户</p>
            <p className="text-3xl font-bold text-pink-400 mt-2">
              {users.filter(u => u.auth === 1).length}
            </p>
          </div>
        </div>

        {/* 用户列表 */}
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
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">暂无用户数据</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">手机号</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">姓名</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">邀请码</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">余额</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">认证状态</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">在线状态</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">注册时间</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-white">{user.id}</td>
                      <td className="px-4 py-3 text-sm text-white">{user.phone}</td>
                      <td className="px-4 py-3 text-sm text-white">{user.name || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        {user.invite_code ? (
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-mono">{user.invite_code}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(user.invite_code || '');
                                alert('邀请码已复制');
                              }}
                              className="px-2 py-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded transition-colors text-xs"
                            >
                              复制
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleGenerateInviteCode(user)}
                            className="px-2 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded transition-colors text-xs"
                          >
                            生成邀请码
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-white">¥{user.money.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        {user.auth === 1 ? (
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">已认证</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">未认证</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {user.is_online ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                            在线
                          </span>
                        ) : (
                          <span className="text-gray-400">离线</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {new Date(user.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded transition-colors text-xs"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleAdjustBalance(user)}
                            className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded transition-colors text-xs"
                          >
                            调整余额
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 编辑模态框 */}
      {showEditModal && editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={handleCancelEdit}
        />
      )}

      {/* 余额调整模态框 */}
      {showBalanceModal && editingUser && (
        <BalanceModal
          user={editingUser}
          onSave={handleSaveBalance}
          onCancel={() => {
            setShowBalanceModal(false);
            setEditingUser(null);
          }}
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
