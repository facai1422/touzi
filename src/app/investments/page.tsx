'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Investment {
  id: number;
  product_name: string;
  amount: number;
  expected_return: number;
  actual_return: number;
  investment_time: string;
  maturity_time: string;
  status: string;
  duration: string;
}

export default function InvestmentsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchInvestments = async () => {
      try {
        setIsLoading(true);
        
        // 获取用户的所有投资记录
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
              name
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('获取投资记录失败:', error);
          return;
        }

        const formattedInvestments = data?.map(inv => ({
          id: inv.id,
          product_name: (inv.investment_projects as { name?: string })?.name || '未知产品',
          amount: inv.amount,
          expected_return: inv.expected_return,
          actual_return: inv.actual_return,
          investment_time: inv.start_date,
          maturity_time: inv.end_date,
          status: inv.status === 'completed' ? '已结算' : '进行中',
          duration: '30分钟'
        })) || [];

        setInvestments(formattedInvestments);
      } catch (error) {
        console.error('获取投资记录失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, [isAuthenticated, user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleInvestmentClick = (investment: Investment) => {
    // 跳转到投资详情页面
    router.push(`/investments/${investment.id}`);
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
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>正在加载投资记录...</p>
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
        <Link href="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>投资明细</h1>
      </div>

      {/* 投资记录列表 */}
      <div style={{ padding: '0.5rem' }}>
        {investments.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '3rem 2rem',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '1rem'
          }}>
            暂无投资记录
          </div>
        ) : (
          investments.map((investment) => (
            <div
              key={investment.id}
              onClick={() => handleInvestmentClick(investment)}
              style={{
                background: 'white',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '0.5rem',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.75rem'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#111827',
                    margin: '0 0 0.5rem 0',
                    lineHeight: '1.25'
                  }}>
                    {investment.product_name}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>
                    状态: {investment.status}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#10b981', marginBottom: '0.25rem' }}>
                    预期收益: ¥{investment.expected_return.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#ef4444' }}>
                    到期时间: {formatDate(investment.maturity_time)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    ¥{investment.amount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '0.25rem' }}>
                    投资: {formatDate(investment.investment_time)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#111827' }}>
                    期限: {investment.duration}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
