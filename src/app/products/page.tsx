'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  id: number
  title: string
  category: string
  rate: string
  day: string
  min: string
  total: string
  percent: number
  cover: string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('全部')
  
  const handleBuyClick = () => {
    alert('项目已结束')
  }

  const categories = ['全部', '医药', '生物技术', '医疗器械', '保健品']

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        title: '复方氨基酸（19）丙谷二肽注射液',
        category: '医药',
        rate: '4.38',
        day: '30',
        min: '5000',
        total: '90000000',
        percent: 24,
        cover: '/92da9381a07d507c50cb64a2b65a001a.png'
      },
      {
        id: 2,
        title: '左乙拉西坦注射用浓溶液',
        category: '医药',
        rate: '4.66',
        day: '30',
        min: '50000',
        total: '50000000',
        percent: 27,
        cover: '/b083004105bee8a447ff9f568b6351f7.jpg'
      },
      {
        id: 3,
        title: '盐酸昂丹司琼注射液',
        category: '医药',
        rate: '5.00',
        day: '30',
        min: '200000',
        total: '90000000',
        percent: 33,
        cover: '/5bfd9d2449b858a6328006141479cee8.jpg'
      },
      {
        id: 4,
        title: '氟伐他汀钠缓释片',
        category: '医药',
        rate: '5.72',
        day: '30',
        min: '500000',
        total: '90000000',
        percent: 45,
        cover: 'https://shiqiao.gzbxwt.com/storage/images/9f2f41f82d9e1ad758f2d304c6867b2b.jpg'
      },
      {
        id: 5,
        title: '胸腺五肽注射液',
        category: '医药',
        rate: '4.85',
        day: '30',
        min: '100000',
        total: '80000000',
        percent: 38,
        cover: 'https://shiqiao.gzbxwt.com/storage/images/cb42af1e487f7ade9d8cd7a9134732a8.jpg'
      },
      {
        id: 6,
        title: '膦甲酸钠注射液',
        category: '医药',
        rate: '5.25',
        day: '30',
        min: '150000',
        total: '70000000',
        percent: 42,
        cover: 'https://shiqiao.gzbxwt.com/storage/images/8d7a7f34bd4e6bf46a19e87fb140f4e3.png'
      }
    ]
    
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredProducts = activeCategory === '全部' 
    ? products 
    : products.filter(product => product.category === activeCategory)

  return (
    <div className="home-page">
      {/* 头部 */}
      <div className="header">
        <div className="header-content">
          <div className="header-title">
            <span>研发产品</span>
          </div>
        </div>
      </div>

      {/* 分类筛选 */}
      <div style={{padding: '1rem', backgroundColor: '#fff'}}>
        <div style={{display: 'flex', gap: '0.5rem', overflowX: 'auto'}}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                backgroundColor: activeCategory === category ? '#ef4444' : '#f3f4f6',
                color: activeCategory === category ? '#fff' : '#6b7280',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 产品列表 */}
      <div style={{padding: '1rem'}}>
        {loading ? (
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <div style={{display: 'inline-block', width: '2rem', height: '2rem', border: '2px solid #ef4444', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
            <p style={{marginTop: '0.5rem', color: '#6b7280'}}>加载中...</p>
          </div>
        ) : (
          <div style={{display: 'grid', gap: '0.75rem'}}>
            {filteredProducts.map((item) => (
              <div key={item.id} className="project-card">
                <div className="project-cover-wrap">
                  <div className="project-cover">
                    {item.cover ? (
                      <img src={item.cover} alt="" className="project-bg" />
                    ) : (
                      <div className="project-bg"></div>
                    )}
                  </div>
                </div>
                <div className="project-content">
                  <div className="project-title-row">
                    <div className="shield-badge">
                      <span>保</span>
                    </div>
                    <div className="project-name">
                      <span>{item.title}</span>
                    </div>
                  </div>
                  <div className="project-row">
                    <div className="data-item">
                      <div className="data-value data-return">
                        <span>{item.rate}%</span>
                      </div>
                      <div className="data-label">
                        <span>日化利率</span>
                      </div>
                    </div>
                    <div className="data-item">
                      <div className="data-value">
                        <span>{item.day}天</span>
                      </div>
                      <div className="data-label">
                        <span>投资期限</span>
                      </div>
                    </div>
                    <div className="data-item">
                      <div className="data-value">
                        <span>¥{item.min}</span>
                      </div>
                      <div className="data-label">
                        <span>起投金额</span>
                      </div>
                    </div>
                           <button className="buy-btn" onClick={handleBuyClick}>
                             {item.percent < 100 ? '马上认购' : '已满额'}
                           </button>
                  </div>
                  <div className="project-info">
                    <div className="project-sub">
                      <span>项目规模：¥{item.total}</span>
                    </div>
                  </div>
                  <div className="progress-container">
                    <div className="progress-text">
                      <span>募集进度 {item.percent}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${item.percent}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
          <Link href="/products" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#ef4444'}}>
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


