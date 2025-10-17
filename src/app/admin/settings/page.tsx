'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminAuthService } from '@/lib/adminAuth';

export default function AdminSettingsPage() {
  const { admin } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 密码修改表单
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // 验证表单
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('新密码和确认密码不一致');
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('新密码长度不能少于6位');
      setLoading(false);
      return;
    }

    try {
      await adminAuthService.changePassword(
        admin!.id,
        passwordForm.oldPassword,
        passwordForm.newPassword
      );
      
      setMessage('密码修改成功！');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      setError(err.message || '密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h2>系统设置</h2>
        <p>管理您的账户设置和系统配置</p>
      </div>

      <div className="settings-container">
        {/* 侧边栏 */}
        <div className="settings-sidebar">
          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="material-icons">person</i>
              个人信息
            </button>
            <button
              className={`menu-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <i className="material-icons">lock</i>
              修改密码
            </button>
            <button
              className={`menu-item ${activeTab === 'system' ? 'active' : ''}`}
              onClick={() => setActiveTab('system')}
            >
              <i className="material-icons">settings</i>
              系统配置
            </button>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-panel">
              <div className="panel-header">
                <h3>个人信息</h3>
                <p>查看和管理您的个人信息</p>
              </div>
              
              <div className="profile-info">
                <div className="info-item">
                  <label>管理员账号</label>
                  <div className="info-value">{admin?.username}</div>
                </div>
                <div className="info-item">
                  <label>姓名</label>
                  <div className="info-value">{admin?.name || '未设置'}</div>
                </div>
                <div className="info-item">
                  <label>邮箱</label>
                  <div className="info-value">{admin?.email || '未设置'}</div>
                </div>
                <div className="info-item">
                  <label>角色</label>
                  <div className="info-value">
                    <span className="role-badge">
                      {admin?.role === 'super_admin' ? '超级管理员' : '管理员'}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <label>最后登录</label>
                  <div className="info-value">
                    {admin?.last_login ? new Date(admin.last_login).toLocaleString('zh-CN') : '从未登录'}
                  </div>
                </div>
                <div className="info-item">
                  <label>创建时间</label>
                  <div className="info-value">
                    {admin?.created_at ? new Date(admin.created_at).toLocaleString('zh-CN') : '-'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="settings-panel">
              <div className="panel-header">
                <h3>修改密码</h3>
                <p>为了账户安全，请定期修改您的密码</p>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="oldPassword">当前密码</label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="请输入当前密码"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">新密码</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="请输入新密码（至少6位）"
                    required
                    minLength={6}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">确认新密码</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="请再次输入新密码"
                    required
                    className="form-input"
                  />
                </div>

                {error && (
                  <div className="error-message">
                    <i className="material-icons">error</i>
                    {error}
                  </div>
                )}

                {message && (
                  <div className="success-message">
                    <i className="material-icons">check_circle</i>
                    {message}
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-save"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="btn-spinner"></div>
                        修改中...
                      </>
                    ) : (
                      <>
                        <i className="material-icons">save</i>
                        修改密码
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="settings-panel">
              <div className="panel-header">
                <h3>系统配置</h3>
                <p>管理系统的基本配置信息</p>
              </div>
              
              <div className="system-info">
                <div className="info-card">
                  <div className="card-header">
                    <i className="material-icons">info</i>
                    <h4>系统信息</h4>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">系统名称</span>
                      <span className="value">投资理财管理后台</span>
                    </div>
                    <div className="info-row">
                      <span className="label">版本</span>
                      <span className="value">v1.0.0</span>
                    </div>
                    <div className="info-row">
                      <span className="label">数据库</span>
                      <span className="value">Supabase</span>
                    </div>
                    <div className="info-row">
                      <span className="label">框架</span>
                      <span className="value">Next.js 15</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <div className="card-header">
                    <i className="material-icons">security</i>
                    <h4>安全设置</h4>
                  </div>
                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">登录保护</span>
                      <span className="value status-enabled">已启用</span>
                    </div>
                    <div className="info-row">
                      <span className="label">密码策略</span>
                      <span className="value">最少6位字符</span>
                    </div>
                    <div className="info-row">
                      <span className="label">会话超时</span>
                      <span className="value">24小时</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-settings {
          max-width: 1200px;
          margin: 0 auto;
        }

        .settings-header {
          margin-bottom: 2rem;
        }

        .settings-header h2 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .settings-header p {
          color: #6c757d;
          margin: 0;
        }

        .settings-container {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .settings-sidebar {
          background: #f8f9fa;
          border-right: 1px solid #e9ecef;
        }

        .sidebar-menu {
          padding: 1rem 0;
        }

        .menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          border: none;
          background: none;
          color: #6c757d;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          font-size: 0.875rem;
        }

        .menu-item:hover {
          background: #e9ecef;
          color: #2c3e50;
        }

        .menu-item.active {
          background: #28a745;
          color: #fff;
        }

        .settings-content {
          padding: 2rem;
        }

        .settings-panel {
          max-width: 600px;
        }

        .panel-header {
          margin-bottom: 2rem;
        }

        .panel-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .panel-header p {
          color: #6c757d;
          margin: 0;
          font-size: 0.875rem;
        }

        .profile-info {
          display: grid;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .info-item label {
          font-weight: 500;
          color: #2c3e50;
        }

        .info-value {
          color: #6c757d;
        }

        .role-badge {
          background: #28a745;
          color: #fff;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .password-form {
          max-width: 400px;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #2c3e50;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #28a745;
        }

        .error-message, .success-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
        }

        .form-actions {
          margin-top: 2rem;
        }

        .btn-save {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #28a745;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .btn-save:hover:not(:disabled) {
          background: #218838;
        }

        .btn-save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-spinner {
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

        .system-info {
          display: grid;
          gap: 1.5rem;
        }

        .info-card {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .card-header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .card-content {
          padding: 1.5rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row .label {
          font-weight: 500;
          color: #2c3e50;
        }

        .info-row .value {
          color: #6c757d;
        }

        .status-enabled {
          color: #28a745;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .settings-container {
            grid-template-columns: 1fr;
          }
          
          .settings-sidebar {
            border-right: none;
            border-bottom: 1px solid #e9ecef;
          }
          
          .sidebar-menu {
            display: flex;
            overflow-x: auto;
            padding: 0.5rem;
          }
          
          .menu-item {
            white-space: nowrap;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}
