'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  const [showBalance, setShowBalance] = useState(true)
  const [userInfo] = useState({
    name: 'asd12',
    phone: '138****8888',
    avatar: 'A'
  })
  const [balance] = useState({
    total: '¥0.00',
    pending: '¥0.00',
    interest: '0.00'
  })

  return (
    <div className="home-page">
      {/* 头部用户信息 */}
      <div className="header" style={{padding: '1rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
          <div style={{width: '4rem', height: '4rem', borderRadius: '50%', background: 'linear-gradient(135deg, #f472b6, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', border: '4px solid #fff'}}>
            {userInfo.avatar}
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{userInfo.name}</div>
            <div style={{fontSize: '0.875rem', opacity: 0.8}}>{userInfo.phone}</div>
          </div>
        </div>
        
        <div style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.75rem', padding: '1rem'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center'}}>
            <div>
              <div style={{fontSize: '0.875rem', opacity: 0.85, marginBottom: '0.25rem'}}>余额</div>
              <div style={{fontWeight: '600', fontSize: '0.875rem'}}>
                {showBalance ? balance.total : '******'}
              </div>
            </div>
            <div>
              <div style={{fontSize: '0.875rem', opacity: 0.85, marginBottom: '0.25rem'}}>待收本金</div>
              <div style={{fontWeight: '600', fontSize: '0.875rem'}}>
                {showBalance ? balance.pending : '******'}
              </div>
            </div>
            <div>
              <div style={{fontSize: '0.875rem', marginBottom: '0.25rem'}}>待收利息</div>
              <div style={{fontWeight: '600', fontSize: '0.875rem'}}>
                {showBalance ? balance.interest : '******'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 菜单容器 */}
      <div style={{padding: '1rem'}}>
        {/* 资产管理 */}
        <div style={{marginBottom: '1rem'}}>
          <h3 style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem', paddingLeft: '0.5rem'}}>资产管理</h3>
          <div style={{backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden'}}>
            <Link href="/real-name" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #f3f4f6'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: '2rem', height: '2rem', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '1.125rem'}}>🛡️</span>
                </div>
                <span style={{fontWeight: '500'}}>实名信息</span>
              </div>
              <span style={{color: '#9ca3af'}}>&gt;</span>
            </Link>
            <Link href="/fund-details" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #f3f4f6'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: '2rem', height: '2rem', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '1.125rem'}}>📋</span>
                </div>
                <span style={{fontWeight: '500'}}>资金明细</span>
              </div>
              <span style={{color: '#9ca3af'}}>&gt;</span>
            </Link>
            <Link href="/investment-details" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: '2rem', height: '2rem', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '1.125rem'}}>📊</span>
                </div>
                <span style={{fontWeight: '500'}}>投资明细</span>
              </div>
              <span style={{color: '#9ca3af'}}>&gt;</span>
            </Link>
          </div>
        </div>

        {/* 交易操作 */}
        <div style={{marginBottom: '1rem'}}>
          <h3 style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem', paddingLeft: '0.5rem'}}>交易操作</h3>
          <div style={{backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden'}}>
            <Link href="/recharge" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #f3f4f6'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: '2rem', height: '2rem', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '1.125rem'}}>⬆️</span>
                </div>
                <span style={{fontWeight: '500'}}>充值</span>
              </div>
              <span style={{color: '#9ca3af'}}>&gt;</span>
            </Link>
            <Link href="/withdraw" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #f3f4f6'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: '2rem', height: '2rem', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '1.125rem'}}>⬇️</span>
                </div>
                <span style={{fontWeight: '500'}}>提款</span>
              </div>
              <span style={{color: '#9ca3af'}}>&gt;</span>
            </Link>
            <Link href="/bank-card" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #f3f4f6'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: '2rem', height: '2rem', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '1.125rem'}}>💳</span>
                </div>
                <span style={{fontWeight: '500'}}>绑定银行卡</span>
              </div>
              <span style={{color: '#9ca3af'}}>&gt;</span>
            </Link>
            <Link href="/usdt-address" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: '2rem', height: '2rem', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '1.125rem'}}>🔗</span>
                </div>
                <span style={{fontWeight: '500'}}>绑定USDT地址</span>
              </div>
              <span style={{color: '#9ca3af'}}>&gt;</span>
            </Link>
          </div>
        </div>

        {/* 账户设置 */}
        <div style={{marginBottom: '1rem'}}>
          <h3 style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem', paddingLeft: '0.5rem'}}>账户设置</h3>
          <div style={{backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden'}}>
            <Link href="/security" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #f3f4f6'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: '2rem', height: '2rem', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '1.125rem'}}>🛡️</span>
                </div>
                <span style={{fontWeight: '500'}}>账号安全</span>
              </div>
              <span style={{color: '#9ca3af'}}>&gt;</span>
            </Link>
            <Link href="/about" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <div style={{width: '2rem', height: '2rem', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: '1.125rem'}}>❓</span>
                </div>
                <span style={{fontWeight: '500'}}>关于我们</span>
              </div>
              <span style={{color: '#9ca3af'}}>&gt;</span>
            </Link>
          </div>
        </div>

        {/* 退出登录 */}
        <div style={{marginTop: '0.75rem'}}>
          <div style={{backgroundColor: '#fff', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden'}}>
            <button style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', color: '#ef4444', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer'}}>
              退出登录
            </button>
          </div>
        </div>

        {/* 版权信息 */}
        <div style={{textAlign: 'center', padding: '1rem'}}>
          <div style={{fontSize: '0.75rem', color: '#9ca3af'}}>© 2025 @北京世桥生物制药有限公司</div>
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
          <Link href="/orders" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
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
          <Link href="/profile" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#ef4444'}}>
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


