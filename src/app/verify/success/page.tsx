'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface VerificationInfo {
  real_name: string;
  id_card: string;
  verified_at: string;
}

export default function VerificationSuccessPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [verificationInfo, setVerificationInfo] = useState<VerificationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查认证状态
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [loading, isAuthenticated, router]);

  // 检查是否已经实名认证
  useEffect(() => {
    if (user && user.auth !== 1) {
      router.push('/verify');
      return;
    }
  }, [user, router]);

  // 获取实名认证信息
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchVerificationInfo = async () => {
      try {
        // 首先尝试从user_verifications表获取认证记录
        const { data: verificationData, error: verificationError } = await supabase
          .from('user_verifications')
          .select('real_name, id_card, created_at')
          .eq('user_id', user.id)
          .eq('status', 1)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (verificationError) {
          console.error('获取实名认证记录失败:', verificationError);
        }

        // 如果认证记录存在，使用认证记录的信息
        if (verificationData) {
          setVerificationInfo({
            real_name: verificationData.real_name,
            id_card: verificationData.id_card,
            verified_at: verificationData.created_at
          });
        } else {
          // 如果没有认证记录，从用户表获取信息
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('real_name, idcard, verified_at')
            .eq('id', user.id)
            .single();

          if (userError) {
            console.error('获取用户信息失败:', userError);
          } else if (userData && userData.real_name) {
            setVerificationInfo({
              real_name: userData.real_name,
              id_card: userData.idcard || '',
              verified_at: userData.verified_at || new Date().toISOString()
            });
          }
        }
      } catch (err) {
        console.error('获取实名认证信息失败:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerificationInfo();
  }, [isAuthenticated, user]);

  // 如果正在加载或未认证，显示加载状态
  if (loading || !isAuthenticated || isLoading) {
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
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>正在加载...</p>
        </div>
      </div>
    );
  }

  // 如果未实名认证，重定向到认证页面
  if (user?.auth !== 1) {
    return null;
  }

  // 格式化身份证号码（脱敏显示）
  const formatIdCard = (idCard: string) => {
    if (idCard.length < 8) return idCard;
    return idCard.substring(0, 4) + '********' + idCard.substring(idCard.length - 4);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
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
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>实名认证</h1>
      </div>

      {/* 成功页面内容 */}
      <div style={{
        background: '#fff',
        margin: '1rem',
        borderRadius: '0.75rem',
        padding: '2rem',
        textAlign: 'center',
        boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
      }}>
        {/* 成功图标 */}
        <div style={{
          width: '5rem',
          height: '5rem',
          background: '#10b981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        
        {/* 成功标题 */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#111827',
          margin: '0 0 0.5rem 0'
        }}>实名认证成功</h2>
        
        {/* 成功描述 */}
        <p style={{
          color: '#6b7280',
          fontSize: '0.875rem',
          margin: '0 0 2rem 0',
          lineHeight: 1.5
        }}>
          您的身份信息已通过验证
        </p>

        {/* 用户信息显示 */}
        {verificationInfo && (
          <div style={{
            background: '#f9fafb',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                fontWeight: 500
              }}>真实姓名</span>
              <span style={{
                fontSize: '0.875rem',
                color: '#111827',
                fontWeight: 600
              }}>{verificationInfo.real_name}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                fontWeight: 500
              }}>身份证号码</span>
              <span style={{
                fontSize: '0.875rem',
                color: '#111827',
                fontWeight: 600
              }}>{formatIdCard(verificationInfo.id_card)}</span>
            </div>
          </div>
        )}

        {/* 不可修改提示 */}
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <circle cx="12" cy="16" r="1"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ color: '#92400e', fontSize: '0.875rem' }}>
            已完成实名认证，信息不可修改
          </span>
        </div>

        {/* 返回按钮 */}
        <Link href="/profile" style={{
          display: 'inline-block',
          background: '#ef4444',
          color: 'white',
          padding: '0.75rem 2rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500
        }}>
          返回我的账户
        </Link>
      </div>

      {/* 底部导航 */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        zIndex: 1000,
        height: '4rem'
      }}>
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
          <Link href="/" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem 0',
            textDecoration: 'none',
            color: '#9ca3af',
            height: '100%'
          }}>
            <img src="/tab-home.svg" alt="首页" style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.25rem' }} />
            <span style={{ fontSize: '0.75rem' }}>首页</span>
          </Link>
          <Link href="/products" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem 0',
            textDecoration: 'none',
            color: '#9ca3af',
            height: '100%'
          }}>
            <img src="https://shiqiao.gzbxwt.com/h5/static/images/tab-products.svg" alt="研发产品" style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.25rem' }} />
            <span style={{ fontSize: '0.75rem' }}>研发产品</span>
          </Link>
          <Link href="/discover" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem 0',
            textDecoration: 'none',
            color: '#9ca3af',
            height: '100%'
          }}>
            <img src="https://shiqiao.gzbxwt.com/h5/static/images/tab-discover.svg" alt="发现" style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.25rem' }} />
            <span style={{ fontSize: '0.75rem' }}>发现</span>
          </Link>
          <Link href="/profile" style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem 0',
            textDecoration: 'none',
            color: '#ef4444',
            height: '100%'
          }}>
            <img src="/tab-profile-active.svg" alt="账户" style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.25rem' }} />
            <span style={{ fontSize: '0.75rem' }}>账户</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
