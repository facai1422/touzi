'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: number;
  phone: string;
  name?: string;
  money: number;
  member_level: number;
  auth: number;
  created_at: string;
  login_time?: string;
  clock: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' });

      // 搜索功能
      if (searchTerm) {
        query = query.or(`phone.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
      }

      // 分页
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('加载用户数据失败:', error);
        return;
      }

      setUsers(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('加载用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadUsers();
  };

  const toggleUserLock = async (userId: number, currentStatus: number) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ clock: currentStatus === 1 ? 0 : 1 })
        .eq('id', userId);

      if (error) {
        console.error('更新用户状态失败:', error);
        return;
      }

      // 重新加载数据
      loadUsers();
    } catch (error) {
      console.error('更新用户状态失败:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h2>用户管理</h2>
        <p>管理系统中的所有用户</p>
      </div>

      {/* 搜索栏 */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="搜索用户手机号或姓名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <i className="material-icons">search</i>
              搜索
            </button>
          </div>
        </form>
      </div>

      {/* 用户列表 */}
      <div className="users-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>正在加载用户数据...</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <div className="table-info">
                共 {users.length} 个用户
              </div>
            </div>

            <div className="users-table">
              <div className="table-header-row">
                <div className="col-id">ID</div>
                <div className="col-phone">手机号</div>
                <div className="col-name">姓名</div>
                <div className="col-balance">余额</div>
                <div className="col-level">会员等级</div>
                <div className="col-auth">认证状态</div>
                <div className="col-status">账户状态</div>
                <div className="col-date">注册时间</div>
                <div className="col-actions">操作</div>
              </div>

              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className="table-row">
                    <div className="col-id">{user.id}</div>
                    <div className="col-phone">{user.phone}</div>
                    <div className="col-name">{user.name || '-'}</div>
                    <div className="col-balance">¥{user.money?.toFixed(2) || '0.00'}</div>
                    <div className="col-level">VIP{user.member_level || 0}</div>
                    <div className="col-auth">
                      <span className={`auth-badge ${user.auth ? 'verified' : 'unverified'}`}>
                        {user.auth ? '已认证' : '未认证'}
                      </span>
                    </div>
                    <div className="col-status">
                      <span className={`status-badge ${user.clock ? 'locked' : 'active'}`}>
                        {user.clock ? '已锁定' : '正常'}
                      </span>
                    </div>
                    <div className="col-date">{formatDate(user.created_at)}</div>
                    <div className="col-actions">
                      <button
                        className={`action-btn ${user.clock ? 'unlock' : 'lock'}`}
                        onClick={() => toggleUserLock(user.id, user.clock)}
                      >
                        <i className="material-icons">
                          {user.clock ? 'lock_open' : 'lock'}
                        </i>
                        {user.clock ? '解锁' : '锁定'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <i className="material-icons">people</i>
                  <p>暂无用户数据</p>
                </div>
              )}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </button>
                
                <div className="page-info">
                  第 {currentPage} 页，共 {totalPages} 页
                </div>
                
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .users-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h2 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .page-header p {
          color: #6c757d;
          margin: 0;
        }

        .search-section {
          background: #fff;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .search-form {
          width: 100%;
        }

        .search-input-group {
          display: flex;
          gap: 1rem;
          max-width: 500px;
        }

        .search-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #28a745;
        }

        .search-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #28a745;
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .search-btn:hover {
          background: #218838;
        }

        .users-table-container {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .table-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e9ecef;
          background: #f8f9fa;
        }

        .table-info {
          color: #6c757d;
          font-size: 0.875rem;
        }

        .users-table {
          overflow-x: auto;
        }

        .table-header-row {
          display: grid;
          grid-template-columns: 60px 120px 100px 100px 80px 100px 100px 150px 100px;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #e9ecef;
        }

        .table-row {
          display: grid;
          grid-template-columns: 60px 120px 100px 100px 80px 100px 100px 150px 100px;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f8f9fa;
          align-items: center;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .col-id, .col-phone, .col-name, .col-balance, .col-level, .col-auth, .col-status, .col-date, .col-actions {
          font-size: 0.875rem;
        }

        .auth-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .auth-badge.verified {
          background: #d4edda;
          color: #155724;
        }

        .auth-badge.unverified {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.locked {
          background: #f8d7da;
          color: #721c24;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s;
        }

        .action-btn.lock {
          background: #dc3545;
          color: #fff;
        }

        .action-btn.unlock {
          background: #28a745;
          color: #fff;
        }

        .action-btn:hover {
          opacity: 0.8;
        }

        .loading-state, .no-data {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: #6c757d;
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid #e9ecef;
          border-top: 2px solid #28a745;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #e9ecef;
        }

        .page-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: #fff;
          color: #2c3e50;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .page-btn:hover:not(:disabled) {
          background: #f8f9fa;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          color: #6c757d;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .table-header-row, .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          
          .search-input-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
