'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface BankCard {
  id: number;
  card_number: string;
  bank_name: string;
  cardholder_name: string;
  is_default: boolean;
}

export default function WithdrawPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState<BankCard | null>(null);
  const [bankCards, setBankCards] = useState<BankCard[]>([]);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 使用useEffect处理重定向
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // 获取银行卡列表
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchBankCards = async () => {
      try {
        const { data, error } = await supabase
          .from('bank_cards')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });

        if (error) {
          console.error('获取银行卡失败:', error);
          return;
        }

        setBankCards(data || []);
        if (data && data.length > 0) {
          setSelectedCard(data[0]);
        }
      } catch (err) {
        console.error('获取银行卡失败:', err);
      }
    };

    fetchBankCards();
  }, [isAuthenticated, user]);

  // 如果正在加载或未认证，显示加载状态
  if (loading || !isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>正在验证身份...</p>
        </div>
      </div>
    );
  }

  const handleWithdraw = async () => {
    if (!amount || !selectedCard || !withdrawPassword) {
      setError('请填写完整信息');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0) {
      setError('提款金额必须大于0');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 这里应该调用提款API
      // 暂时模拟成功
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 提款成功后跳转到成功页面
      router.push('/withdraw/success');
    } catch (err) {
      setError('提款失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCardNumber = (cardNumber: string) => {
    if (cardNumber.length <= 4) return cardNumber;
    return '**** **** **** ' + cardNumber.slice(-4);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: '4rem' }}>
      {/* 顶部导航 */}
      <div style={{
        background: 'white',
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link href="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>提款</h1>
      </div>

      <div style={{ padding: '1rem' }}>
        {/* 提款金额 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              提款金额
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem', color: '#111827', marginRight: '0.5rem' }}>¥</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="请输入提款金额"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '1.5rem',
                  color: '#111827',
                  background: 'transparent'
                }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              最低提款金额：¥100
            </div>
          </div>
        </div>

        {/* 选择银行卡 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              选择银行卡
            </div>
            {bankCards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
                  暂未绑定银行卡
                </div>
                <Link href="/bank-card" style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: '#3b82f6',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  立即绑定
                </Link>
              </div>
            ) : (
              <div>
                {bankCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    style={{
                      padding: '1rem',
                      border: selectedCard?.id === card.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                      background: selectedCard?.id === card.id ? '#f0f9ff' : 'white'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>
                          {card.bank_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          {formatCardNumber(card.card_number)}
                        </div>
                      </div>
                      {selectedCard?.id === card.id && (
                        <div style={{ color: '#3b82f6' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Link href="/bank-card" style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '0.75rem',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  border: '1px dashed #3b82f6',
                  borderRadius: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  + 添加银行卡
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 提款密码 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              提款密码
            </div>
            <input
              type="password"
              value={withdrawPassword}
              onChange={(e) => setWithdrawPassword(e.target.value)}
              placeholder="请输入提款密码"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {/* 提款按钮 */}
        <button
          onClick={handleWithdraw}
          disabled={isLoading || !amount || !selectedCard || !withdrawPassword}
          style={{
            width: '100%',
            padding: '1rem',
            background: isLoading || !amount || !selectedCard || !withdrawPassword ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: isLoading || !amount || !selectedCard || !withdrawPassword ? 'not-allowed' : 'pointer',
            marginBottom: '1rem'
          }}
        >
          {isLoading ? '处理中...' : '确认提款'}
        </button>

        {/* 提款说明 */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1rem',
          boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
            提款说明
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.5' }}>
            <div style={{ marginBottom: '0.25rem' }}>• 提款申请提交后，我们将在1-3个工作日内处理</div>
            <div style={{ marginBottom: '0.25rem' }}>• 提款金额将直接转入您选择的银行卡</div>
            <div style={{ marginBottom: '0.25rem' }}>• 如有疑问，请联系客服</div>
          </div>
        </div>
      </div>
    </div>
  );
}
