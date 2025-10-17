'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AccountSecurityPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [showLoginPasswordForm, setShowLoginPasswordForm] = useState(false);
  const [showWithdrawPasswordForm, setShowWithdrawPasswordForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 密码表单状态
  const [loginPasswordForm, setLoginPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [withdrawPasswordForm, setWithdrawPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

  const handleLoginPasswordChange = async () => {
    if (!loginPasswordForm.currentPassword || !loginPasswordForm.newPassword || !loginPasswordForm.confirmPassword) {
      setError('请填写完整信息');
      return;
    }

    if (loginPasswordForm.newPassword !== loginPasswordForm.confirmPassword) {
      setError('新密码和确认密码不一致');
      return;
    }

    if (loginPasswordForm.newPassword.length < 6) {
      setError('新密码长度至少6位');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // 验证当前密码
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: loginPasswordForm.currentPassword
      });

      if (signInError) {
        setError('当前密码错误');
        return;
      }

      // 更新密码
      const { error: updateError } = await supabase.auth.updateUser({
        password: loginPasswordForm.newPassword
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess('登录密码修改成功');
      setLoginPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowLoginPasswordForm(false);
    } catch (err) {
      setError('修改登录密码失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdrawPasswordChange = async () => {
    if (!withdrawPasswordForm.currentPassword || !withdrawPasswordForm.newPassword || !withdrawPasswordForm.confirmPassword) {
      setError('请填写完整信息');
      return;
    }

    if (withdrawPasswordForm.newPassword !== withdrawPasswordForm.confirmPassword) {
      setError('新密码和确认密码不一致');
      return;
    }

    if (withdrawPasswordForm.newPassword.length < 6) {
      setError('新密码长度至少6位');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // 这里应该验证提现密码（需要根据实际业务逻辑实现）
      // 暂时使用简单的验证
      if (withdrawPasswordForm.currentPassword !== '123456') {
        setError('当前提现密码错误');
        return;
      }

      // 更新提现密码到用户元数据
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          withdraw_password: withdrawPasswordForm.newPassword
        }
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess('提现密码修改成功');
      setWithdrawPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowWithdrawPasswordForm(false);
    } catch (err) {
      setError('修改提现密码失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
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
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>账户安全</h1>
      </div>

      <div style={{ padding: '1rem' }}>
        {/* 安全设置选项 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
          }}>
            {/* 修改登录密码 */}
            <div
              onClick={() => setShowLoginPasswordForm(true)}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '1rem',
                cursor: 'pointer',
                color: '#111827',
                borderBottom: '1px solid #f3f4f6',
                width: '100%'
              }}
            >
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div style={{
                flex: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
                marginLeft: 0
              }}>修改登录密码</div>
              <div style={{
                color: '#9ca3af',
                fontSize: '1.25rem',
                marginLeft: 'auto',
                flexShrink: 0
              }}>›</div>
            </div>

            {/* 修改提现密码 */}
            <div
              onClick={() => setShowWithdrawPasswordForm(true)}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '1rem',
                cursor: 'pointer',
                color: '#111827',
                width: '100%'
              }}
            >
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#ef4444'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '100%', height: '100%'}}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div style={{
                flex: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
                marginLeft: 0
              }}>修改提现密码</div>
              <div style={{
                color: '#9ca3af',
                fontSize: '1.25rem',
                marginLeft: 'auto',
                flexShrink: 0
              }}>›</div>
            </div>
          </div>
        </div>

        {/* 修改登录密码表单 */}
        {showLoginPasswordForm && (
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
              修改登录密码
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                当前密码
              </label>
              <input
                type="password"
                value={loginPasswordForm.currentPassword}
                onChange={(e) => setLoginPasswordForm({ ...loginPasswordForm, currentPassword: e.target.value })}
                placeholder="请输入当前密码"
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
                新密码
              </label>
              <input
                type="password"
                value={loginPasswordForm.newPassword}
                onChange={(e) => setLoginPasswordForm({ ...loginPasswordForm, newPassword: e.target.value })}
                placeholder="请输入新密码"
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
                确认新密码
              </label>
              <input
                type="password"
                value={loginPasswordForm.confirmPassword}
                onChange={(e) => setLoginPasswordForm({ ...loginPasswordForm, confirmPassword: e.target.value })}
                placeholder="请再次输入新密码"
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

            {success && (
              <div style={{
                background: '#f0fdf4',
                color: '#16a34a',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {success}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setShowLoginPasswordForm(false);
                  setLoginPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setError('');
                  setSuccess('');
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
                onClick={handleLoginPasswordChange}
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
                {isSubmitting ? '修改中...' : '确认修改'}
              </button>
            </div>
          </div>
        )}

        {/* 修改提现密码表单 */}
        {showWithdrawPasswordForm && (
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
              修改提现密码
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                当前提现密码
              </label>
              <input
                type="password"
                value={withdrawPasswordForm.currentPassword}
                onChange={(e) => setWithdrawPasswordForm({ ...withdrawPasswordForm, currentPassword: e.target.value })}
                placeholder="请输入当前提现密码"
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
                新提现密码
              </label>
              <input
                type="password"
                value={withdrawPasswordForm.newPassword}
                onChange={(e) => setWithdrawPasswordForm({ ...withdrawPasswordForm, newPassword: e.target.value })}
                placeholder="请输入新提现密码"
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
                确认新提现密码
              </label>
              <input
                type="password"
                value={withdrawPasswordForm.confirmPassword}
                onChange={(e) => setWithdrawPasswordForm({ ...withdrawPasswordForm, confirmPassword: e.target.value })}
                placeholder="请再次输入新提现密码"
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

            {success && (
              <div style={{
                background: '#f0fdf4',
                color: '#16a34a',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {success}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setShowWithdrawPasswordForm(false);
                  setWithdrawPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setError('');
                  setSuccess('');
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
                onClick={handleWithdrawPasswordChange}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: isSubmitting ? '#9ca3af' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? '修改中...' : '确认修改'}
              </button>
            </div>
          </div>
        )}

        {/* 安全提示 */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1rem',
          boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
            安全提示
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.5' }}>
            <div style={{ marginBottom: '0.25rem' }}>• 请定期修改密码，确保账户安全</div>
            <div style={{ marginBottom: '0.25rem' }}>• 密码长度至少6位，建议包含字母和数字</div>
            <div style={{ marginBottom: '0.25rem' }}>• 不要将密码告诉他人</div>
            <div style={{ marginBottom: '0.25rem' }}>• 如发现异常，请立即联系客服</div>
            <div>• 提现密码用于资金安全，请妥善保管</div>
          </div>
        </div>
      </div>
    </div>
  );
}
