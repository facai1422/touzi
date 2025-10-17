'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface Product {
  id: number
  title_zh_cn: string
  profit_rate: number
  duration: number
  min_invest: number
  price: number
  current_progress: number
  max_progress: number
  img_zh_cn: string | null
  status: number
}

export default function HomePage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()
  
  const handleBuyClick = () => {
    alert('项目已结束')
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
  }, [authLoading, isAuthenticated, router])

  // 从数据库加载产品数据
  useEffect(() => {
    if (!isAuthenticated) return

    const loadProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 1) // 只获取上架的产品
          .order('sort', { ascending: true })
          .limit(10)

        if (error) {
          console.error('加载产品失败:', error)
          setLoading(false)
          return
        }

        setProducts(data || [])
        setLoading(false)
      } catch (err) {
        console.error('加载产品失败:', err)
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
          <div className="user-info">
            <span>欢迎，{user?.phone}</span>
            <span className="user-balance">余额：¥{user?.money?.toFixed(2) || '0.00'}</span>
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
                     />
                   ))}
                 </div>
               </div>
             </div>

      {/* 快捷操作 */}
      <div className="quick-actions">
        <div className="quick-row">
          <div className="quick-action">
            <div className="qa-icon qa-icon-products">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="8" height="8" rx="1"></rect>
                <rect x="13" y="3" width="8" height="8" rx="1"></rect>
                <rect x="3" y="13" width="8" height="8" rx="1"></rect>
                <rect x="13" y="13" width="8" height="8" rx="1"></rect>
              </svg>
            </div>
            <div className="qa-text">
              <span>研发产品</span>
            </div>
          </div>
          <div className="quick-action">
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
          </div>
          <div className="quick-action" onClick={() => window.open('https://chat2.boltcode.vip?visiter_id=&visiter_name=&avatar=&business_id=1&groupid=0&special=1', '_blank')}>
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
        </div>
        <div className="quick-row">
          <div className="quick-action">
            <div className="qa-icon qa-icon-withdraw">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v10"></path>
                <path d="M9 10l3 3 3-3"></path>
                <rect x="4" y="17" width="16" height="2" rx="1"></rect>
              </svg>
            </div>
            <div className="qa-text">
              <span>提款</span>
            </div>
          </div>
          <div className="quick-action">
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
                      <span>{item.title_zh_cn}</span>
                    </div>
                  </div>
                  <div className="project-row">
                    <div className="data-item">
                      <div className="data-value data-return">
                        <span>{item.profit_rate.toFixed(2)}%</span>
                      </div>
                      <div className="data-label">
                        <span>日化利率</span>
                      </div>
                    </div>
                    <div className="data-item">
                      <div className="data-value">
                        <span>{item.duration}天</span>
                      </div>
                      <div className="data-label">
                        <span>投资期限</span>
                      </div>
                    </div>
                    <div className="data-item">
                      <div className="data-value">
                        <span>¥{item.min_invest.toLocaleString()}</span>
                      </div>
                      <div className="data-label">
                        <span>起投金额</span>
                      </div>
                    </div>
                           <button 
                             className="buy-btn" 
                             onClick={handleBuyClick}
                             aria-label={item.current_progress < item.max_progress ? '马上认购' : '已满额'}
                           >
                             {item.current_progress < item.max_progress ? '马上认购' : '已满额'}
                           </button>
                  </div>
                  <div className="project-info">
                    <div className="project-sub">
                      <span>项目规模：¥{item.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="progress-container">
                    <div className="progress-text">
                      <span>募集进度 {Math.round((item.current_progress / item.max_progress) * 100)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${(item.current_progress / item.max_progress) * 100}%`}}></div>
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
          <Link href="/" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#ef4444'}}>
            <img src="/tab-home-active.svg" alt="首页" style={{width: '1.5rem', height: '1.5rem'}} />
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>首页</span>
          </Link>
          <Link href="/products" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <img src="https://shiqiao.gzbxwt.com/h5/static/images/tab-products.svg" alt="研发产品" style={{width: '1.5rem', height: '1.5rem'}} />
            <span style={{fontSize: '0.75rem', marginTop: '0.25rem'}}>研发产品</span>
          </Link>
          <Link href="/discover" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0', color: '#9ca3af'}}>
            <img src="https://shiqiao.gzbxwt.com/h5/static/images/tab-discover.svg" alt="发现" style={{width: '1.5rem', height: '1.5rem'}} />
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