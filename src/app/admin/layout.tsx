'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, logout, isAdmin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const router = useRouter();

  // 检查管理员权限
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/admin/login');
      return;
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>正在验证管理员权限...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: 'dashboard', name: '仪表盘', icon: 'dashboard', href: '/admin' },
    { id: 'users', name: '用户管理', icon: 'people', href: '/admin/users' },
    { id: 'products', name: '产品管理', icon: 'inventory', href: '/admin/products' },
    { id: 'orders', name: '订单管理', icon: 'shopping_cart', href: '/admin/orders' },
    { id: 'finance', name: '财务管理', icon: 'account_balance', href: '/admin/finance' },
    { id: 'activities', name: '活动管理', icon: 'event', href: '/admin/activities' },
    { id: 'articles', name: '文章管理', icon: 'article', href: '/admin/articles' },
    { id: 'settings', name: '系统设置', icon: 'settings', href: '/admin/settings' },
  ];

  return (
    <div className="admin-layout">
      {/* 侧边栏 */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src="/logo.png" alt="Logo" />
            <span>投资理财管理后台</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="material-icons">close</i>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.id} className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}>
                <Link 
                  href={item.href}
                  className="nav-link"
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <i className="material-icons nav-icon">{item.icon}</i>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* 主内容区域 */}
      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* 头部 */}
        <header className="admin-header">
          <div className="header-left">
            <button 
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="material-icons">menu</i>
            </button>
            <h1 className="header-title">管理后台</h1>
          </div>
          
          <div className="header-right">
            <div className="admin-info">
              <div className="admin-avatar">
                {admin?.name?.charAt(0) || admin?.username?.charAt(0) || 'A'}
              </div>
              <span>{admin?.name || admin?.username || '管理员'}</span>
            </div>
            
            <div className="header-actions">
              <Link href="/admin/settings" className="settings-link">
                设置
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                退出登录
              </button>
            </div>
          </div>
        </header>

        {/* 内容区域 */}
        <div className="admin-content">
          {children}
        </div>
      </main>

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}