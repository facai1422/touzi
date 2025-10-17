'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WithdrawSuccessPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // 使用useEffect处理重定向
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

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
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>提款成功</h1>
      </div>

      <div style={{ padding: '1rem' }}>
        {/* 成功提示 */}
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
            background: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
            提款申请已提交
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            您的提款申请已成功提交，我们将在1-3个工作日内处理
          </p>
        </div>

        {/* 提款详情 */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
            提款详情
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>提款金额</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>¥500.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>手续费</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>¥0.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>到账金额</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>¥500.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>提款时间</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>2025-10-17 09:03</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>状态</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#10b981' }}>处理中</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/profile" style={{
            flex: 1,
            padding: '0.75rem',
            background: '#f3f4f6',
            color: '#6b7280',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            返回账户
          </Link>
          <Link href="/finance" style={{
            flex: 1,
            padding: '0.75rem',
            background: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            查看明细
          </Link>
        </div>
      </div>
    </div>
  );
}
