'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface InvestmentDetail {
  id: number;
  product_name: string;
  amount: number;
  expected_return: number;
  actual_return: number;
  investment_time: string;
  maturity_time: string;
  status: string;
  duration: string;
  interest_rate: number;
  contract_number: string;
}

export default function InvestmentDetailPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const investmentId = params.id;

  const [investment, setInvestment] = useState<InvestmentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !user || !investmentId) return;

    const fetchInvestmentDetail = async () => {
      try {
        setIsLoading(true);
        
        // 获取投资详情
        const { data, error } = await supabase
          .from('user_investments')
          .select(`
            id,
            amount,
            expected_return,
            actual_return,
            start_date,
            end_date,
            status,
            created_at,
            investment_projects (
              name,
              interest_rate
            )
          `)
          .eq('id', investmentId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('获取投资详情失败:', error);
          router.push('/investments');
          return;
        }

        const formattedInvestment: InvestmentDetail = {
          id: data.id,
          product_name: data.investment_projects?.name || '未知产品',
          amount: data.amount,
          expected_return: data.expected_return,
          actual_return: data.actual_return,
          investment_time: data.start_date,
          maturity_time: data.end_date,
          status: data.status === 'completed' ? '已结算' : '进行中',
          duration: '30分钟',
          interest_rate: data.investment_projects?.interest_rate || 0,
          contract_number: `INV${data.id.toString().padStart(8, '0')}`
        };

        setInvestment(formattedInvestment);
      } catch (error) {
        console.error('获取投资详情失败:', error);
        router.push('/investments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestmentDetail();
  }, [isAuthenticated, user, investmentId, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleDetailsClick = () => {
    setShowModal(true);
  };

  const handleContractClick = () => {
    // 跳转到担保合同页面
    router.push(`/invest/contract?investmentId=${investmentId}`);
  };

  if (loading || isLoading) {
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
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>正在加载投资详情...</p>
        </div>
      </div>
    );
  }

  if (!investment) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>投资记录不存在</p>
          <Link href="/investments" style={{
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: '0.875rem',
            marginTop: '1rem',
            display: 'inline-block'
          }}>
            返回投资明细
          </Link>
        </div>
      </div>
    );
  }

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
        <Link href="/investments" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>投资明细</h1>
      </div>

      {/* 投资详情 */}
      <div style={{ padding: '0.5rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '0.5rem'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827',
            margin: '0 0 1rem 0'
          }}>
            {investment.product_name}
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>投资金额:</span>
            <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
              ¥{investment.amount.toLocaleString()}
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>预期收益:</span>
            <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>
              ¥{investment.expected_return.toFixed(2)}
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>投资时间:</span>
            <span style={{ fontSize: '0.875rem', color: '#111827' }}>
              {formatDate(investment.investment_time)}
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>到期时间:</span>
            <span style={{ fontSize: '0.875rem', color: '#111827' }}>
              {formatDate(investment.maturity_time)}
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>收益方式:</span>
            <span style={{ fontSize: '0.875rem', color: '#111827' }}>
              30分钟还本返息
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>已支付:</span>
            <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
              ¥{investment.amount.toLocaleString()}
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>状态:</span>
            <span style={{ fontSize: '0.875rem', color: '#111827' }}>
              {investment.status}
            </span>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1rem',
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '1rem'
      }}>
        <button
          onClick={handleDetailsClick}
          style={{
            flex: 1,
            height: '3rem',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          明细
        </button>
        
        <button
          onClick={handleContractClick}
          style={{
            flex: 1,
            height: '3rem',
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          合同
        </button>
      </div>

      {/* 明细弹窗 */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            margin: '1rem',
            maxWidth: '90%',
            width: '100%',
            maxHeight: '80%',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#111827',
                margin: 0
              }}>
                投资明细
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>投资金额:</span>
              <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
                ¥{investment.amount.toLocaleString()}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>预期收益:</span>
              <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>
                ¥{investment.expected_return.toFixed(2)}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>投资时间:</span>
              <span style={{ fontSize: '0.875rem', color: '#111827' }}>
                {formatDate(investment.investment_time)}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>到期时间:</span>
              <span style={{ fontSize: '0.875rem', color: '#111827' }}>
                {formatDate(investment.maturity_time)}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>收益方式:</span>
              <span style={{ fontSize: '0.875rem', color: '#111827' }}>
                30分钟还本返息
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>已支付:</span>
              <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
                ¥{investment.amount.toLocaleString()}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>状态:</span>
              <span style={{ fontSize: '0.875rem', color: '#111827' }}>
                {investment.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
