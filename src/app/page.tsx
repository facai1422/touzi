'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { ChatWindow } from '@/components/customer-service/ChatWindow'
import { PreloadIframe } from '@/components/PreloadIframe'
import { IframeChatWindow } from '@/components/IframeChatWindow'

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

export default function HomePage() {
  const { loading: authLoading, isAuthenticated, refreshUserBalance, user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showChat, setShowChat] = useState(false)
  const [showIframeChat, setShowIframeChat] = useState(false)
  const router = useRouter()
  
  const handleBuyClick = (product: Product) => {
    console.log('马上认购按钮被点击:', product);
    // 检查产品状态
    if (product.status === 'inactive') {
      alert('产品已关闭');
      return;
    }
    // 跳转到对应产品的详情页面
    router.push(`/products/${product.id}/`)
  }
  
  const carouselImages = [
    {
      src: "/1afcff22e30deaa28685adfc3e942569.jpeg",
      alt: "轮播图1",
      desc: "北京世桥生物制药有限公司"
    },
    {
      src: "/2a9e28ab022cf3106de64d7bf85047a5.jpeg", 
      alt: "轮播图2",
      desc: "专业生物制药研发"
    }
  ]

  // 轮播图自动切换
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 3000)
    
    return () => clearInterval(timer)
  }, [carouselImages.length])

  // 检查认证状态
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
      return
    }
    
    // 刷新用户余额
    if (isAuthenticated) {
      refreshUserBalance()
    }
  }, [authLoading, isAuthenticated, router, refreshUserBalance])

  // 从数据库加载产品数据
  useEffect(() => {
    if (!isAuthenticated) return

    const loadProducts = async () => {
      try {
        console.log('🔄 开始加载产品数据...')
        
        const { data, error } = await supabase
          .from('investment_projects')
          .select('*')
          .in('status', ['active', 'inactive', 'paused']) // 显示活跃、关闭和暂停的产品
          .order('id', { ascending: true })
          .limit(10)

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
  }, [isAuthenticated])

  // 如果正在加载认证状态，显示加载页面
  if (authLoading) {
    return (
      <div className="loading-page">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>正在验证身份...</p>
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
    )
  }

  // 如果未认证，不显示内容（会被重定向到登录页）
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="home-page">
      {/* 头部 */}
      <div className="header">
        <div className="header-content">
          <div className="header-title">
            <span>北京世桥生物制药有限公司</span>
          </div>
        </div>
      </div>

             {/* 轮播图 */}
             <div className="carousel-container">
               <div className="carousel">
                 {carouselImages.map((image, index) => (
                   <div 
                     key={index}
                     className={`carousel-item ${index === currentSlide ? 'active' : ''}`}
                     style={{
                       display: index === currentSlide ? 'block' : 'none'
                     }}
                   >
                     <div className="carousel-image">
                       <img src={image.src} alt={image.alt} className="carousel-bg" />
                     </div>
                     <div className="carousel-overlay">
                       <div className="carousel-text">
                         <div className="carousel-desc">{image.desc}</div>
                       </div>
                     </div>
                   </div>
                 ))}
                 
                 {/* 轮播图指示器 */}
                 <div className="carousel-indicators">
                   {carouselImages.map((_, index) => (
                     <button
                       key={index}
                       className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                       onClick={() => setCurrentSlide(index)}
                       title={`切换到第${index + 1}张图片`}
                     />
                   ))}
                 </div>
               </div>
             </div>

      {/* 快捷操作 */}
      <div className="quick-actions">
        <div className="quick-row">
          {/* 充值 */}
          <div className="quick-action" onClick={() => setShowIframeChat(true)}>
            <div className="qa-icon qa-icon-recharge">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="7" width="18" height="12" rx="2"></rect>
                <path d="M16 13h5"></path>
              </svg>
            </div>
            <div className="qa-text">
              <span>充值</span>
            </div>
          </div>
          {/* 提现 */}
          <Link href="/withdraw" className="quick-action">
            <div className="qa-icon qa-icon-withdraw">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v10"></path>
                <path d="M9 10l3 3 3-3"></path>
                <rect x="4" y="17" width="16" height="2" rx="1"></rect>
              </svg>
            </div>
            <div className="qa-text">
              <span>提现</span>
            </div>
          </Link>
          {/* 在线客服 */}
          <div className="quick-action" onClick={() => setShowIframeChat(true)}>
            <div className="qa-icon qa-icon-service">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5h16v10H7l-3 3V5z"></path>
                <path d="M8 10h8"></path>
                <path d="M8 14h6"></path>
              </svg>
            </div>
            <div className="qa-text">
              <span>在线客服</span>
            </div>
          </div>
          {/* 关于我们 */}
          <Link href="/about" className="quick-action">
            <div className="qa-icon qa-icon-about">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 10v6"></path>
                <circle cx="12" cy="7" r="1"></circle>
              </svg>
            </div>
            <div className="qa-text">
              <span>关于我们</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 通知栏 */}
      <div className="notice-container">
        <div className="notice-content">
          <div className="notice-icon">
            <div className="icon-volume">🔔</div>
          </div>
          <div className="notice-text marquee">
            <div className="marquee-inner" style={{animationDuration: '8s'}}>
              <div className="notice-message duplicate">
                <span>北京世桥生物制药有限公司欢迎您！</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 项目列表 */}
      <div className="projects-container">
        <div className="projects-header">
          <div className="projects-title">
            <span>项目列表</span>
          </div>
        </div>
        <div className="projects-list">
          {loading ? (
            <div style={{textAlign: 'center', padding: '2rem'}}>
              <div style={{display: 'inline-block', width: '2rem', height: '2rem', border: '2px solid #ef4444', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
              <p style={{marginTop: '0.5rem', color: '#6b7280'}}>加载中...</p>
            </div>
          ) : (
            products.map((item) => (
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
                           <button 
                             className="buy-btn" 
                             onClick={() => handleBuyClick(item)}
                             aria-label={item.status === 'inactive' ? '已关闭' : Number(item.invested_amount) < Number(item.total_amount) ? '马上认购' : '已满额'}
                           >
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
            ))
          )}
        </div>
      </div>

      {/* 底部导航 */}
      <nav style={{position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTop: '1px solid #e5e7eb'}}>
        <div style={{display: 'flex'}}>
          <Link href="/" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#ef4444', textDecoration: 'none'}}>
            <img src="/首页(1).png" alt="首页" style={{width: '2rem', height: '2rem'}} />
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>首页</span>
          </Link>
          <Link href="/products" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af', textDecoration: 'none'}}>
            <img src="/产品组1-2.png" alt="研发产品" style={{width: '2rem', height: '2rem'}} />
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

      {/* 客服窗口 */}
      {showChat && user && (
        <ChatWindow 
          userId={user.id.toString()} 
          onClose={() => setShowChat(false)}
        />
      )}

      {/* iframe 客服/充值窗口 */}
      {showIframeChat && (
        <IframeChatWindow 
          url="https://chat2.boltcode.vip?visiter_id=&visiter_name=&avatar=&business_id=1&groupid=0&special=1"
          title="在线客服"
          onClose={() => setShowIframeChat(false)}
        />
      )}

      {/* 预加载发现页面的 iframe（在后台加载，用户看不见） */}
      <PreloadIframe />
    </div>
  )
}