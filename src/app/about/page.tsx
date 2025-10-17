'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AboutPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // 使用useEffect处理重定向
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // 如果正在加载或未认证，显示加载状态
  if (loading || !isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>正在验证身份...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: '4rem' }}>
      {/* 顶部导航 */}
      <div style={{
        background: 'white',
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Link href="/profile" style={{ 
          color: '#111827', 
          textDecoration: 'none', 
          marginRight: '1rem',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          border: '1px solid #e5e7eb'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>关于我们</h1>
      </div>

      <div style={{ padding: '1rem' }}>
        {/* 公司简介 */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '8rem',
              height: '8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              padding: '0.5rem'
            }}>
              <img 
                src="/1afcff22e30deaa28685adfc3e942569.jpeg" 
                alt="世桥生物Logo" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '0.5rem',
                  boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
              北京世桥生物制药有限公司
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Beijing Shiqiao Biomedical Co., Ltd.
            </p>
          </div>
          
          <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '1rem' }}>
              北京世桥生物制药有限公司成立于2002年4月10日，是一家从事药品研发、生产和销售的国家级高新技术企业。公司总部位于北京市顺义区，以环保和可持续发展的设计理念并建设完成占地约8万平方米，建筑面积约5万平方米，环保、绿色的现代化厂区。已实现污水处理后循环再利用和废气区域环境基线值排放。
            </p>
            <p style={{ marginBottom: '1rem' }}>
              "做健康产业创新的领航者"为企业愿景，秉承"团结、创新、卓越、共赢"的核心价值观，公司多年来与北京大学、清华大学、北京化工大学、中国医学科学院药物研究所、哥伦比亚大学等多家科研机构建立广泛且深入的产学研合作。
            </p>
            <p style={{ marginBottom: '1rem' }}>
              以"新工艺、新制剂、新药物"为企业的主要发展方向和核心竞争力，公司现拥有以中国GMP、欧盟GMP及美国FDA cGMP为标准建设的多条世界先进产品生产线。为扩大生产规模，公司于2009年7月启动投资二期项目建设，从欧美引进世界先进的生产设备，运用世界领先的MES管理系统，建成了小容量无菌制剂、冻干/水针、原料药、大输液、固体制剂等多条国际先进工艺的生产车间。
            </p>
            <p style={{ marginBottom: '1rem' }}>
              公司始终坚持以人为本的用人理念，尊重和保护员工的各项合法权益，拥有完善的薪酬、福利和保险制度；为员工搭建了优秀的个性化成长平台，持续提升员工在经营管理、专业技术、操作技能等各方面的能力，促进员工与企业的共同进步和全面发展，努力打造一流的国际化人才队伍。
            </p>
            <p style={{ marginBottom: '1rem' }}>
              企业已获得科技部"十二·五"重大新药创制专项、北京市科委双十计划项目、重大科技攻关项目及北京市高成长企业资助创新科技专项等多项政府资助。获得了北京新药创制产学研联盟共建单位、北京药品安全百千万工程药品质量管理示范企业和北京市专利示范单位等多项荣誉。
            </p>
            <p>
              世桥生物正向着国际一流创新型制药企业的目标不断迈进。
            </p>
          </div>
        </div>

        {/* 公司信息 */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
            公司信息
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#6b7280' }}>公司名称</span>
              <span>北京世桥生物制药有限公司</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#6b7280' }}>成立时间</span>
              <span>2002年4月10日</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#6b7280' }}>注册资本</span>
              <span>5000万元</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#6b7280' }}>企业性质</span>
              <span>有限责任公司</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#6b7280' }}>经营范围</span>
              <span>生物制药研发、生产、销售</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>注册地址</span>
              <span>北京市顺义区</span>
            </div>
          </div>
        </div>

        {/* 联系我们 */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
            联系我们
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '100%', height: '100%'}}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <span>客服热线：400-888-8888</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '100%', height: '100%'}}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <span>邮箱：service@shiqiao.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '100%', height: '100%'}}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <span>地址：北京市朝阳区世桥大厦</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '100%', height: '100%'}}>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <span>工作时间：周一至周五 9:00-18:00</span>
            </div>
          </div>
        </div>

        {/* 企业资质 */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
            企业资质
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '0.5rem' }}>• 高新技术企业证书</div>
            <div style={{ marginBottom: '0.5rem' }}>• 药品生产许可证</div>
            <div style={{ marginBottom: '0.5rem' }}>• GMP认证证书</div>
            <div style={{ marginBottom: '0.5rem' }}>• ISO9001质量管理体系认证</div>
            <div style={{ marginBottom: '0.5rem' }}>• ISO14001环境管理体系认证</div>
            <div>• 药品经营许可证</div>
          </div>
        </div>

        {/* 发展历程 */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
            发展历程
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid #3b82f6' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>2002年4月10日</div>
              <div>公司成立，开始药品研发、生产和销售</div>
            </div>
            <div style={{ marginBottom: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid #3b82f6' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>2009年7月</div>
              <div>启动投资二期项目建设，引进世界先进生产设备</div>
            </div>
            <div style={{ marginBottom: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid #3b82f6' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>2010年代</div>
              <div>获得多项政府资助和荣誉，建立产学研合作</div>
            </div>
            <div style={{ marginBottom: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid #3b82f6' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>2020年代</div>
              <div>建成多条国际先进工艺生产车间，获得多项认证</div>
            </div>
            <div style={{ paddingLeft: '1rem', borderLeft: '2px solid #3b82f6' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>至今</div>
              <div>向着国际一流创新型制药企业的目标不断迈进</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
