'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Product {
  id: number
  name: string
  description: string
  min_amount: number
  max_amount: number
  interest_rate: number
  duration_days: number
  total_amount: number
  invested_amount: number
  status: string
  img_zh_cn: string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('医药')
  
  const handleBuyClick = (productId: number, productStatus?: string) => {
    // 检查产品状态
    if (productStatus === 'inactive') {
      alert('产品已关闭');
      return;
    }
    // 跳转到产品详情页面
    window.location.href = `/products/${productId}`;
  }

  const categories = ['医药']

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('🔄 开始加载产品数据...')
        
        const { data, error } = await supabase
          .from('investment_projects')
          .select('*')
          .in('status', ['active', 'inactive', 'paused']) // 显示活跃、关闭和暂停的产品，但不显示deleted
          .order('id', { ascending: true })

        if (error) {
          console.error('❌ 数据库查询失败:', error)
          console.log('🔄 使用备用产品数据...')
          
          // 使用备用产品数据
          const fallbackProducts = [
            {
              id: 1,
              name: '复方氨基酸（19）丙谷二肽注射液',
              description: '低风险稳健理财产品，适合保守型投资者',
              min_amount: 5000,
              max_amount: 100000,
              interest_rate: 6.50,
              duration_days: 0.020833,
              total_amount: 1000000,
              invested_amount: 500000,
              status: 'active',
              img_zh_cn: '/92da9381a07d507c50cb64a2b65a001a.png'
            },
            {
              id: 2,
              name: '左乙拉西坦注射用浓溶液',
              description: '中等风险成长型基金，适合稳健型投资者',
              min_amount: 5000,
              max_amount: 500000,
              interest_rate: 8.20,
              duration_days: 0.020833,
              total_amount: 2000000,
              invested_amount: 1200000,
              status: 'active',
              img_zh_cn: '/b083004105bee8a447ff9f568b6351f7.jpg'
            },
            {
              id: 3,
              name: '盐酸昂丹司琼注射液',
              description: '高风险高收益产品，适合激进型投资者',
              min_amount: 10000,
              max_amount: 1000000,
              interest_rate: 12.00,
              duration_days: 0.020833,
              total_amount: 5000000,
              invested_amount: 3000000,
              status: 'active',
              img_zh_cn: '/5bfd9d2449b858a6328006141479cee8.jpg'
            },
            {
              id: 4,
              name: '氟伐他汀钠缓释片',
              description: '短期理财产品，灵活投资',
              min_amount: 500,
              max_amount: 50000,
              interest_rate: 4.50,
              duration_days: 0.020833,
              total_amount: 90000000,
              invested_amount: 200000,
              status: 'active',
              img_zh_cn: 'https://shiqiao.gzbxwt.com/storage/images/9f2f41f82d9e1ad758f2d304c6867b2b.jpg'
            },
            {
              id: 5,
              name: '胸腺五肽注射液',
              description: '长期投资项目，稳定收益',
              min_amount: 20000,
              max_amount: 2000000,
              interest_rate: 9.80,
              duration_days: 0.020833,
              total_amount: 80000000,
              invested_amount: 5000000,
              status: 'active',
              img_zh_cn: 'https://shiqiao.gzbxwt.com/storage/images/cb42af1e487f7ade9d8cd7a9134732a8.jpg'
            },
            {
              id: 6,
              name: '膦甲酸钠注射液',
              description: '膦甲酸钠注射液是一种抗病毒药物，用于治疗病毒感染',
              min_amount: 150000,
              max_amount: 1000000,
              interest_rate: 5.25,
              duration_days: 0.020833,
              total_amount: 90000000,
              invested_amount: 40500000,
              status: 'active',
              img_zh_cn: 'https://shiqiao.gzbxwt.com/storage/images/8d7a7f34bd4e6bf46a19e87fb140f4e3.png'
            },
          ]
          
          setProducts(fallbackProducts)
          setLoading(false)
          return
        }

        console.log('✅ 产品数据加载成功:', data?.length || 0, '个产品')
        setProducts(data || [])
        setLoading(false)
      } catch (err) {
        console.error('❌ 加载产品失败:', err)
        console.log('🔄 使用备用产品数据...')
        
        // 使用备用产品数据
        const fallbackProducts = [
          {
            id: 1,
            name: '复方氨基酸（19）丙谷二肽注射液',
            description: '低风险稳健理财产品，适合保守型投资者',
            min_amount: 5000,
            max_amount: 100000,
            interest_rate: 6.50,
            duration_days: 0.020833,
            total_amount: 1000000,
            invested_amount: 500000,
            status: 'active',
            img_zh_cn: '/92da9381a07d507c50cb64a2b65a001a.png'
          }
        ]
        
        setProducts(fallbackProducts)
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = products

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
                    {item.img_zh_cn ? (
                      <img src={item.img_zh_cn} alt="" className="project-bg" />
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
                      <span>{item.name}</span>
                    </div>
                  </div>
                  <div className="project-row">
                    <div className="data-item">
                      <div className="data-value data-return">
                        <span>{item.interest_rate}%</span>
                      </div>
                      <div className="data-label">
                        <span>日化利率</span>
                      </div>
                    </div>
                    <div className="data-item">
                      <div className="data-value">
                        <span>30分钟</span>
                      </div>
                      <div className="data-label">
                        <span>投资期限</span>
                      </div>
                    </div>
                    <div className="data-item">
                      <div className="data-value">
                        <span>¥{Number(item.min_amount).toLocaleString()}</span>
                      </div>
                      <div className="data-label">
                        <span>起投金额</span>
                      </div>
                    </div>
                           <button className="buy-btn" onClick={() => handleBuyClick(item.id, item.status)}>
                             {item.status === 'inactive' ? '已关闭' : Number(item.invested_amount) < Number(item.total_amount) ? '马上认购' : '已满额'}
                           </button>
                  </div>
                  <div className="project-info">
                    <div className="project-sub">
                      <span>项目规模：¥{Number(item.total_amount).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="progress-container">
                    <div className="progress-text">
                      <span>募集进度 {Math.round((Number(item.invested_amount) / Number(item.total_amount)) * 100)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${(Number(item.invested_amount) / Number(item.total_amount)) * 100}%`}}></div>
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
          <Link href="/" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af', textDecoration: 'none'}}>
            <img src="/首页.png" alt="首页" style={{width: '2rem', height: '2rem'}} />
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>首页</span>
          </Link>
          <Link href="/products" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#ef4444', textDecoration: 'none'}}>
            <img src="/产品组1-2(1).png" alt="研发产品" style={{width: '2rem', height: '2rem'}} />
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>研发产品</span>
          </Link>
          <Link href="/discover" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af', textDecoration: 'none'}}>
            <img src="/发现.png" alt="发现" style={{width: '2rem', height: '2rem'}} />
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>发现</span>
          </Link>
          <Link href="/profile" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af', textDecoration: 'none'}}>
            <img src="/我的(1).png" alt="账户" style={{width: '2rem', height: '2rem'}} />
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>账户</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}


