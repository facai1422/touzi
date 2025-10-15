'use client'

import Link from 'next/link'

export default function OrdersPage() {
  return (
    <div className="home-page">
      {/* 头部 */}
      <div className="header">
        <div className="header-content">
          <div className="header-title">
            <span>我的项目</span>
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div style={{padding: '1rem'}}>
        <div style={{backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', padding: '1.5rem', textAlign: 'center'}}>
          <div style={{color: '#6b7280', marginBottom: '1rem'}}>
            <svg style={{width: '4rem', height: '4rem', margin: '0 auto 1rem', color: '#d1d5db'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 style={{fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '0.5rem'}}>暂无投资记录</h3>
            <p style={{color: '#6b7280'}}>您还没有任何投资项目</p>
          </div>
          <Link href="/products" style={{display: 'inline-block', backgroundColor: '#ef4444', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none'}}>
            去投资
          </Link>
        </div>
      </div>

      {/* 底部导航 */}
      <nav style={{position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTop: '1px solid #e5e7eb'}}>
        <div style={{display: 'flex'}}>
          <Link href="/" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <svg style={{width: '1.5rem', height: '1.5rem'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3.172l8 6.4V20a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5H10v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-10l8-6.4zM12 1l-10 8v1.5a1 1 0 002 0V10l8-6.4L20 10v.5a1 1 0 002 0V9L12 1z"/>
            </svg>
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>首页</span>
          </Link>
          <Link href="/products" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <svg style={{width: '1.5rem', height: '1.5rem'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>研发产品</span>
          </Link>
          <Link href="/orders" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#ef4444'}}>
            <svg style={{width: '1.5rem', height: '1.5rem'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>我的项目</span>
          </Link>
          <Link href="/discover" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <svg style={{width: '1.5rem', height: '1.5rem'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>发现</span>
          </Link>
          <Link href="/profile" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <svg style={{width: '1.5rem', height: '1.5rem'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>账户</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}


