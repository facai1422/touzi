'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
    inviteCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // 使用useEffect处理重定向
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  // 如果正在加载或已认证，显示加载状态
  if (authLoading || isAuthenticated) {
    return (
      <div className="loading-page">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>正在跳转...</p>
        </div>
        <style jsx>{`
          .loading-page {
            min-height: 100vh;
            background: #f9fafb;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loading-content {
            text-align: center;
          }
          .loading-spinner {
            width: 3rem;
            height: 3rem;
            border: 3px solid #e5e7eb;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          p {
            color: #6b7280;
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.phone) {
      setError('请输入账号');
      return false;
    }
    
    if (!formData.password) {
      setError('请输入密码');
      return false;
    }
    
    if (formData.password.length < 6 || formData.password.length > 16) {
      setError('请输入6-16位密码');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('两次密码输入不一致');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await userService.register({
        phone: formData.phone,
        password: formData.password,
        inviteCode: formData.inviteCode || undefined
      });

      // 注册成功后自动登录
      await login(formData.phone, formData.password);
      router.push('/');
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="card">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <div className="success-title">注册成功</div>
            <div className="success-desc">系统赠送10元奖励，正在跳转到登录页面...</div>
          </div>
        </div>
        
        <style jsx>{`
          .auth-page {
            min-height: 100vh;
            background: #f9fafb;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1.25rem;
          }
          
          .card {
            width: 100%;
            max-width: 20rem;
            background: #fff;
            border-radius: 0.75rem;
            padding: 2rem;
            box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.06);
            text-align: center;
          }
          
          .success-icon {
            width: 3rem;
            height: 3rem;
            background: #10b981;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0 auto 1rem;
          }
          
          .success-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 0.5rem;
          }
          
          .success-desc {
            color: #6b7280;
            font-size: 0.875rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="logo-wrap">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
      </div>
      
      <div className="card">
        <div className="title">账号注册</div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-item">
            <div className="input">
              <div className="uni-input-wrapper">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="uni-input-input"
                  required
                  aria-label="请输入账号"
                />
                <div className={`uni-input-placeholder input-placeholder ${formData.phone ? 'active' : ''}`}>
                  请输入账号
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-item">
            <div className="input">
              <div className="uni-input-wrapper">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="uni-input-input"
                  required
                  aria-label="请输入密码"
                />
                <div className={`uni-input-placeholder input-placeholder ${formData.password ? 'active' : ''}`}>
                  请输入密码
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-item">
            <div className="input">
              <div className="uni-input-wrapper">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="uni-input-input"
                  required
                  aria-label="请确认密码"
                />
                <div className={`uni-input-placeholder input-placeholder ${formData.confirmPassword ? 'active' : ''}`}>
                  请确认密码
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-item">
            <div className="input">
              <div className="uni-input-wrapper">
                <input
                  type="text"
                  name="inviteCode"
                  value={formData.inviteCode}
                  onChange={handleInputChange}
                  className="uni-input-input"
                  aria-label="邀请码（选填）"
                />
                <div className={`uni-input-placeholder input-placeholder ${formData.inviteCode ? 'active' : ''}`}>
                  邀请码（选填）
                </div>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-item">
            <button 
              type="submit" 
              className={`btn primary ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </div>
        </form>
        
        <div className="login-link">
          <a href="/login">已有账号？立即登录</a>
        </div>
      </div>
      
      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.25rem 1.25rem 2.5rem;
          box-sizing: border-box;
        }
        
        .logo-wrap {
          width: 8.125rem;
          height: 8.125rem;
          margin-top: 1.875rem;
          margin-bottom: 1.875rem;
          flex-shrink: 0;
        }
        
        .logo {
          width: 100%;
          height: 100%;
          border-radius: 0.75rem;
        }
        
        .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .card {
          width: 100%;
          max-width: 20rem;
          background: #fff;
          border-radius: 0.75rem;
          padding: 1.25rem;
          box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.06);
          flex-shrink: 0;
        }
        
        .title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .form-item {
          margin-bottom: 0.75rem;
        }
        
        .input {
          position: relative;
          width: 100%;
          height: 2.75rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }
        
        .uni-input-wrapper {
          display: flex;
          position: relative;
          width: 100%;
          height: 100%;
          flex-direction: column;
          justify-content: center;
        }
        
        .uni-input-placeholder {
          position: absolute;
          top: 50%;
          left: 1rem;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 0.875rem;
          pointer-events: none;
          transition: all 0.2s;
          background: #f9fafb;
          padding: 0 0.25rem;
        }
        
        .uni-input-placeholder.active {
          opacity: 0;
          visibility: hidden;
        }
        
        .uni-input-input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.875rem;
          color: #111827;
          padding: 0 1rem;
        }
        
        .uni-input-input:focus + .uni-input-placeholder {
          opacity: 0;
          visibility: hidden;
        }
        
        .btn {
          width: 100%;
          height: 2.75rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn.primary {
          background: #3b82f6;
          color: #fff;
        }
        
        .btn.primary:hover:not(:disabled) {
          background: #2563eb;
        }
        
        .btn.primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        
        .btn.loading {
          position: relative;
        }
        
        .btn.loading::after {
          content: '';
          position: absolute;
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-message {
          color: #ef4444;
          font-size: 0.75rem;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        
        .login-link {
          text-align: center;
          margin-top: 1rem;
        }
        
        .login-link a {
          color: #3b82f6;
          text-decoration: none;
          font-size: 0.875rem;
        }
        
        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
