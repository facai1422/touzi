'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.phone, formData.password);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="logo-wrap">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
      </div>
      
      <div className="card">
        <div className="title">账号登录</div>
        
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
                  aria-label="请输入登录密码"
                />
                <div className={`uni-input-placeholder input-placeholder ${formData.password ? 'active' : ''}`}>
                  请输入登录密码
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
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>
        
        <div className="register-link">
          <a href="/register">还没有账号？立即注册</a>
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
        
        .register-link {
          text-align: center;
          margin-top: 1rem;
        }
        
        .register-link a {
          color: #3b82f6;
          text-decoration: none;
          font-size: 0.875rem;
        }
        
        .register-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
