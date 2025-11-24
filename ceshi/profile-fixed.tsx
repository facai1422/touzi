'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: number;
  phone: string;
  name?: string;
  money: number;
  member_level: number;
  auth: number;
  created_at: string;
  real_name?: string; // 实名后的真实姓名
}

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // 使用useEffect处理重定向
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // 获取用户详细信息
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('获取用户信息失败:', error);
          setUserProfile(user as UserProfile);
        } else {
          setUserProfile(data);
        }
      } catch (err) {
        console.error('获取用户信息失败:', err);
        setUserProfile(user as UserProfile);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user]);

  // 如果正在加载或未认证，显示加载状态
  if (loading || !isAuthenticated || profileLoading) {
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

  const handleLogout = () => {
    logout();
  };

  // 获取显示名称：实名后显示真实姓名，否则显示手机号
  const getDisplayName = () => {
    if (userProfile?.auth && userProfile?.real_name) {
      return userProfile.real_name;
    }
    return userProfile?.phone || '用户';
  };

  // 获取头像显示文字
  const getAvatarText = () => {
    if (userProfile?.auth && userProfile?.real_name) {
      return userProfile.real_name.charAt(0);
    }
    return userProfile?.phone?.charAt(0) || '用';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: '4rem' }}>
      {/* 顶部用户信息区域 */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        padding: '1.5rem 1rem 2rem',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>
              {getAvatarText()}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              {getDisplayName()}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              {userProfile?.auth ? '已实名认证' : '未实名认证'}
            </div>
          </div>
        </div>
        
        {/* 账户概览 */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{
            flex: 1,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>余额</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fbbf24' }}>
              ¥{userProfile?.money?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div style={{
            flex: 1,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>待收本金</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>¥0.00</div>
          </div>
          <div style={{
            flex: 1,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>待收利息</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>¥0.00</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '1rem' }}>
        {/* 资产管理 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
            padding: '0 0.5rem',
            fontWeight: 500
          }}>资产管理</div>
          <div style={{
            background: '#fff',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
          }}>
            <Link href="/verify" style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '1rem',
              textDecoration: 'none',
              color: '#111827',
              borderBottom: '1px solid #f3f4f6',
              width: '100%'
            }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#3b82f6'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '100%', height: '100%'}}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div style={{
                flex: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
                marginLeft: 0
              }}>实名信息</div>
              <div style={{
                color: '#9ca3af',
                fontSize: '1.25rem',
                marginLeft: 'auto',
                flexShrink: 0
              }}>›</div>
            </Link>
            <Link href="/finance" style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '1rem',
              textDecoration: 'none',
              color: '#111827',
              borderBottom: '1px solid #f3f4f6',
              width: '100%'
            }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#f59e0b'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '100%', height: '100%'}}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <path d="M9 9h6v6H9z"/>
                </svg>
              </div>
              <div style={{
                flex: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
                marginLeft: 0
              }}>资金明细</div>
              <div style={{
                color: '#9ca3af',
                fontSize: '1.25rem',
                marginLeft: 'auto',
                flexShrink: 0
              }}>›</div>
            </Link>
            <Link href="/orders" style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '1rem',
              textDecoration: 'none',
              color: '#111827',
              width: '100%'
            }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#10b981'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '100%', height: '100%'}}>
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div style={{
                flex: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
                marginLeft: 0
              }}>投资明细</div>
              <div style={{
                color: '#9ca3af',
                fontSize: '1.25rem',
                marginLeft: 'auto',
                flexShrink: 0
              }}>›</div>
            </Link>
          </div>
        </div>

        {/* 交易操作 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
            padding: '0 0.5rem',
            fontWeight: 500
          }}>交易操作</div>
          <div style={{
            background: '#fff',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
          }}>
            <Link href="/recharge" style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '1rem',
              textDecoration: 'none',
              color: '#111827',
              borderBottom: '1px solid #f3f4f6',
              width: '100%'
            }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#3b82f6'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '100%', height: '100%'}}>
                  <path d="M12 3v10"/>
                  <path d="M9 10l3-3 3 3"/>
                  <rect x="4" y="17" width="16" height="2" rx="1"/>
                </svg>
              </div>
              <div style={{
                flex: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
                marginLeft: 0
              }}>充值</div>
              <div style={{
                color: '#9ca3af',
                fontSize: '1.25rem',
                marginLeft: 'auto',
                flexShrink: 0
              }}>›</div>
            </Link>
            <Link href="/withdraw" style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '1rem',
              textDecoration: 'none',
              color: '#111827',
              borderBottom: '1px solid #f3f4f6',
              width: '100%'
            }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#3b82f6'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '100%', height: '100%'}}>
                  <path d="M12 21v-10"/>
                  <path d="M9 14l3 3 3-3"/>
                  <rect x="4" y="3" width="16" height="2" rx="1"/>
                </svg>
              </div>
              <div style={{
                flex: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
                marginLeft: 0
              }}>提款</div>
              <div style={{
                color: '#9ca3af',
                fontSize: '1.25rem',
                marginLeft: 'auto',
                flexShrink: 0
              }}>›</div>
            </Link>
            <Link href="/bank-card" style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '1rem',
              textDecoration: 'none',
              color: '#111827',
              width: '100%'
            }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#ec4899'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '100%', height: '100%'}}>
                  <rect x="2" y="6" width="20" height="12" rx="2"/>
                  <path d="M2 10h20"/>
                </svg>
              </div>
              <div style={{
                flex: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
                marginLeft: 0
              }}>绑定银行卡</div>
              <div style={{
                color: '#9ca3af',
                fontSize: '1.25rem',
                marginLeft: 'auto',
                flexShrink: 0
              }}>›</div>
            </Link>
          </div>
        </div>

        {/* 登出按钮 */}
        <div style={{ padding: '1rem 0' }}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            退出登录
          </button>
        </div>
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
