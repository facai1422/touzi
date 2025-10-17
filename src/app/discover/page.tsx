'use client'

import Link from 'next/link'

export default function DiscoverPage() {
  return (
    <div className="discover-page">
      {/* 头部 */}
      <div className="header">
        <div className="header-content">
          <div className="header-title">
            <span>发现</span>
          </div>
        </div>
      </div>

      {/* 网页容器 */}
      <div className="web-container">
        <iframe 
          className="web-iframe"
          sandbox="allow-popups allow-top-navigation-by-user-activation allow-scripts allow-modals allow-popups allow-downloads allow-pointer-lock allow-presentation"
          allow="fullscreen; camera; microphone; geolocation"
          referrerPolicy="no-referrer"
          src="http://www.sciecure.com/"
        />
      </div>

      {/* 底部导航 */}
      <nav style={{position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTop: '1px solid #e5e7eb'}}>
        <div style={{display: 'flex'}}>
          <Link href="/" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <img src="/tab-home.svg" alt="首页" style={{width: '1.5rem', height: '1.5rem'}} />
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>首页</span>
          </Link>
          <Link href="/products" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <img src="https://shiqiao.gzbxwt.com/h5/static/images/tab-products.svg" alt="研发产品" style={{width: '1.5rem', height: '1.5rem'}} />
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>研发产品</span>
          </Link>
          <Link href="/discover" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#ef4444'}}>
            <img src="https://shiqiao.gzbxwt.com/h5/static/images/tab-discover-active.svg" alt="发现" style={{width: '1.5rem', height: '1.5rem'}} />
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>发现</span>
          </Link>
          <Link href="/profile" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <img src="https://shiqiao.gzbxwt.com/h5/static/images/tab-profile.svg" alt="账户" style={{width: '1.5rem', height: '1.5rem'}} />
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>账户</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}