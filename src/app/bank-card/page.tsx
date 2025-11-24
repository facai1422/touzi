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
  created_at: string;
}

export default function BankCardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [bankCards, setBankCards] = useState<BankCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    card_number: '',
    bank_name: '',
    cardholder_name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('获取银行卡失败:', error);
          return;
        }

        setBankCards(data || []);
      } catch (err) {
        console.error('获取银行卡失败:', err);
      } finally {
        setIsLoading(false);
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

  const handleAddCard = async () => {
    if (!newCard.card_number || !newCard.bank_name || !newCard.cardholder_name) {
      setError('请填写完整信息');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('bank_cards')
        .insert({
          user_id: user?.id,
          card_number: newCard.card_number,
          bank_name: newCard.bank_name,
          cardholder_name: newCard.cardholder_name,
          is_default: bankCards.length === 0 // 如果是第一张卡，设为默认
        });

      if (error) {
        throw error;
      }

      // 刷新银行卡列表
      if (!user?.id) {
        setError('用户信息获取失败');
        return;
      }

      const { data: updatedCards, error: fetchError } = await supabase
        .from('bank_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (!fetchError) {
        setBankCards(updatedCards || []);
      }

      setShowAddForm(false);
      setNewCard({ card_number: '', bank_name: '', cardholder_name: '' });
    } catch (err) {
      setError('添加银行卡失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (cardId: number) => {
    try {
      // 先取消所有默认状态
      await supabase
        .from('bank_cards')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // 设置新的默认卡
      await supabase
        .from('bank_cards')
        .update({ is_default: true })
        .eq('id', cardId);

      // 刷新列表
      if (!user?.id) {
        setError('用户信息获取失败');
        return;
      }

      const { data, error } = await supabase
        .from('bank_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error) {
        setBankCards(data || []);
      }
    } catch (err) {
      console.error('设置默认卡失败:', err);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm('确定要删除这张银行卡吗？')) return;

    try {
      const { error } = await supabase
        .from('bank_cards')
        .delete()
        .eq('id', cardId);

      if (error) {
        throw error;
      }

      // 刷新列表
      if (!user?.id) {
        setError('用户信息获取失败');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('bank_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (!fetchError) {
        setBankCards(data || []);
      }
    } catch (err) {
      console.error('删除银行卡失败:', err);
    }
  };

  const formatCardNumber = (cardNumber: string) => {
    if (cardNumber.length <= 4) return cardNumber;
    return '**** **** **** ' + cardNumber.slice(-4);
  };

  const getBankIcon = (bankName: string) => {
    // 根据银行名称返回对应的图标或颜色
    if (bankName.includes('工商')) return '#dc2626';
    if (bankName.includes('建设')) return '#059669';
    if (bankName.includes('农业')) return '#0d9488';
    if (bankName.includes('中国')) return '#dc2626';
    if (bankName.includes('招商')) return '#dc2626';
    return '#3b82f6';
  };

  if (isLoading) {
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
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>加载中...</p>
        </div>
      </div>
    );
  }

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
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>银行卡管理</h1>
      </div>

      <div style={{ padding: '1rem' }}>
        {/* 银行卡列表 */}
        {bankCards.length > 0 ? (
          <div style={{ marginBottom: '1.5rem' }}>
            {bankCards.map((card) => (
              <div
                key={card.id}
                style={{
                  background: 'white',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
                  border: card.is_default ? '2px solid #3b82f6' : '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      background: getBankIcon(card.bank_name),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>
                        {card.bank_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>
                        {card.bank_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {formatCardNumber(card.card_number)}
                      </div>
                    </div>
                  </div>
                  {card.is_default && (
                    <div style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}>
                      默认
                    </div>
                  )}
                </div>
                
                <div style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '1rem' }}>
                  <div style={{ marginBottom: '0.25rem' }}>持卡人：{card.cardholder_name}</div>
                  <div style={{ color: '#6b7280' }}>绑定时间：{new Date(card.created_at).toLocaleDateString()}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!card.is_default && (
                    <button
                      onClick={() => handleSetDefault(card.id)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: '#f3f4f6',
                        color: '#6b7280',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      设为默认
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#9ca3af' }}>
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M2 10h20"/>
              </svg>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              暂未绑定银行卡
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              立即绑定
            </button>
          </div>
        )}

        {/* 添加银行卡按钮 */}
        {bankCards.length > 0 && (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'white',
              color: '#3b82f6',
              border: '2px dashed #3b82f6',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '1.5rem'
            }}
          >
            + 添加银行卡
          </button>
        )}

        {/* 添加银行卡表单 */}
        {showAddForm && (
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
              添加银行卡
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                持卡人姓名
              </label>
              <input
                type="text"
                value={newCard.cardholder_name}
                onChange={(e) => setNewCard({ ...newCard, cardholder_name: e.target.value })}
                placeholder="请输入持卡人姓名"
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

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                银行名称
              </label>
              <input
                type="text"
                value={newCard.bank_name}
                onChange={(e) => setNewCard({ ...newCard, bank_name: e.target.value })}
                placeholder="请输入银行名称"
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

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                银行卡号
              </label>
              <input
                type="text"
                value={newCard.card_number}
                onChange={(e) => setNewCard({ ...newCard, card_number: e.target.value })}
                placeholder="请输入银行卡号"
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

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewCard({ card_number: '', bank_name: '', cardholder_name: '' });
                  setError('');
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={handleAddCard}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: isSubmitting ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? '添加中...' : '确认添加'}
              </button>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1rem',
          boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
            使用说明
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.5' }}>
            <div style={{ marginBottom: '0.25rem' }}>• 绑定银行卡用于提款和充值</div>
            <div style={{ marginBottom: '0.25rem' }}>• 请确保银行卡信息准确无误</div>
            <div style={{ marginBottom: '0.25rem' }}>• 可以设置一张默认银行卡</div>
            <div>• 如有疑问，请联系客服</div>
          </div>
        </div>
      </div>
    </div>
  );
}
