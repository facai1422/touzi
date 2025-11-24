'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';


interface Product {
  id: number;
  title: string;
  category: string;
  rate: string;
  day: string;
  min: string;
  total: string;
  percent: number;
  cover: string | null;
  description?: string;
  settlement_method?: string;
  risk_level?: string;
  fund_usage?: string;
  guarantor?: string;
  start_date?: string;
  end_date?: string;
  repayment_date?: string;
  status?: string; // 产品状态
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [isVerified, setIsVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProductClosed, setIsProductClosed] = useState(false);

  // 处理立即投资按钮点击
  const handleBuyClick = () => {
    if (product) {
      console.log('立即投资按钮被点击:', product);
      router.push(`/invest/confirm?productId=${product.id}`);
    }
  };

  // 格式化日期显示 - 北京时间
  // const formatDate = (dateString: string) => {
  //   if (!dateString) return '未知时间';
    
  //   return new Date(dateString).toLocaleString('zh-CN', {
  //     timeZone: 'Asia/Shanghai',
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit',
  //     hour12: false
  //   });
  // };

  // 检查用户实名认证状态
  useEffect(() => {
    const checkVerification = async () => {
      if (!user) {
        setCheckingVerification(false);
        return;
      }

      try {
        // 从 user_verifications 表检查
        const { data: verificationData } = await supabase
          .from('user_verifications')
          .select('real_name, status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // 如果 user_verifications 表没有数据，检查 users 表
        if (!verificationData?.real_name) {
          const { data: userData } = await supabase
            .from('users')
            .select('real_name, verification_status')
            .eq('id', user.id)
            .single();

          if (userData && userData.real_name) {
            setIsVerified(true);
          } else {
            setIsVerified(false);
            setErrorMessage('请先完成实名认证');
          }
        } else {
          // 只要 user_verifications 表有记录，就认为已认证（无论status）
          setIsVerified(true);
        }
      } catch (error) {
        console.error('检查实名认证失败:', error);
        setIsVerified(false);
        setErrorMessage('检查认证状态失败，请重试');
      } finally {
        setCheckingVerification(false);
      }
    };

    checkVerification();
  }, [user]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('🔍 开始获取产品详情，产品ID:', params.id);
        
        // 从数据库获取产品详情
        const productId = parseInt(Array.isArray(params.id) ? params.id[0] : params.id || '0');
        console.log('🔍 查询产品ID:', productId, '类型:', typeof productId);
        
        const { data, error } = await supabase
          .from('investment_projects')
          .select('*')
          .eq('id', productId)
          .single();

        console.log('🔍 查询结果 - data:', data);
        console.log('🔍 查询结果 - error:', error);

        if (error) {
          console.error('获取产品详情失败:', error);
          console.error('错误详情:', JSON.stringify(error, null, 2));
          console.log('🔄 使用模拟数据，产品ID:', params.id);
          // 如果数据库中没有，使用模拟数据
          const mockProducts = [
            {
              id: 1,
              title: '复方氨基酸（19）丙谷二肽注射液',
              category: '医药',
              rate: '4.38',
              day: '30',
              min: '5000',
              total: '1000000',
              percent: 24,
              cover: '/92da9381a07d507c50cb64a2b65a001a.png',
              description: '复方氨基酸（19）丙谷二肽注射液是一种营养支持药物',
              settlement_method: '按分钟付收益，到期自动赎回',
              risk_level: '提供基金托管服务',
              fund_usage: '本次发行资金，主要用于混合型股权直投运作',
              guarantor: '中国人民保险集团股份有限公司',
              start_date: '募满当日',
              end_date: '2025-10-22',
              repayment_date: '2025-10-23'
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
              cover: '/b083004105bee8a447ff9f568b6351f7.jpg',
              description: '左乙拉西坦注射用浓溶液是一种抗癫痫药物',
              settlement_method: '按分钟付收益，到期自动赎回',
              risk_level: '提供基金托管服务',
              fund_usage: '本次发行资金，主要用于混合型股权直投运作',
              guarantor: '中国人民保险集团股份有限公司',
              start_date: '募满当日',
              end_date: '2025-10-22',
              repayment_date: '2025-10-23'
            },
            {
              id: 3,
              title: '盐酸昂丹司琼注射液',
              category: '医药',
              rate: '5.00',
              day: '30',
              min: '10000',
              total: '30000000',
              percent: 35,
              cover: '/5bfd9d2449b858a6328006141479cee8.jpg',
              description: '盐酸昂丹司琼注射液是一种止吐药物',
              settlement_method: '按分钟付收益，到期自动赎回',
              risk_level: '提供基金托管服务',
              fund_usage: '本次发行资金，主要用于混合型股权直投运作',
              guarantor: '中国人民保险集团股份有限公司',
              start_date: '募满当日',
              end_date: '2025-10-22',
              repayment_date: '2025-10-23'
            },
            {
              id: 4,
              title: '注射用头孢曲松钠',
              category: '医药',
              rate: '4.50',
              day: '30',
              min: '8000',
              total: '40000000',
              percent: 42,
              cover: '/8d7a7f34bd4e6bf46a19e87fb140f4e3.png',
              description: '注射用头孢曲松钠是一种抗生素药物',
              settlement_method: '按分钟付收益，到期自动赎回',
              risk_level: '提供基金托管服务',
              fund_usage: '本次发行资金，主要用于混合型股权直投运作',
              guarantor: '中国人民保险集团股份有限公司',
              start_date: '募满当日',
              end_date: '2025-10-22',
              repayment_date: '2025-10-23'
            },
            {
              id: 5,
              title: '注射用阿莫西林钠克拉维酸钾',
              category: '医药',
              rate: '4.20',
              day: '30',
              min: '6000',
              total: '35000000',
              percent: 38,
              cover: '/9f2f41f82d9e1ad758f2d304c6867b2b.jpg',
              description: '注射用阿莫西林钠克拉维酸钾是一种复合抗生素',
              settlement_method: '按分钟付收益，到期自动赎回',
              risk_level: '提供基金托管服务',
              fund_usage: '本次发行资金，主要用于混合型股权直投运作',
              guarantor: '中国人民保险集团股份有限公司',
              start_date: '募满当日',
              end_date: '2025-10-22',
              repayment_date: '2025-10-23'
            }
          ];
          
          // 根据产品ID查找对应的产品
          const foundProduct = mockProducts.find(p => p.id === Number(params.id));
          console.log('🔍 查找产品，产品ID:', params.id, '找到产品:', foundProduct);
          if (foundProduct) {
            console.log('✅ 设置产品数据:', foundProduct.title);
            setProduct(foundProduct);
          } else {
            console.log('⚠️ 未找到对应产品，使用默认产品:', mockProducts[0].title);
            // 如果找不到对应产品，使用默认产品
            setProduct(mockProducts[0]);
          }
        } else {
          console.log('✅ 数据库查询成功，产品数据:', data);
          
          // 检查产品状态是否为关闭/不活跃
          if (data.status !== 'active') {
            setIsProductClosed(true);
            setErrorMessage('产品已关闭');
            // 仍然显示产品信息，但按钮会被禁用
          }
          
          // 格式化数据库数据
          const formattedProduct: Product = {
            id: data.id,
            title: data.name,
            category: '医药',
            rate: data.interest_rate.toString(),
            day: '30',
            min: data.min_amount.toString(),
            total: data.total_amount.toString(),
            percent: Math.round((data.invested_amount / data.total_amount) * 100),
            cover: null,
            description: data.description,
            settlement_method: '按分钟付收益，到期自动赎回',
            risk_level: '提供基金托管服务',
            fund_usage: '本次发行资金，主要用于混合型股权直投运作',
            guarantor: '中国人民保险集团股份有限公司',
            start_date: '募满当日',
            end_date: new Date(Date.now() + data.duration_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            repayment_date: new Date(Date.now() + (data.duration_days + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: data.status
          };
          console.log('✅ 设置数据库产品数据:', formattedProduct.title);
          setProduct(formattedProduct);
        }
      } catch (error) {
        console.error('获取产品详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f5f5f5',
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
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>正在加载产品详情...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>产品不存在</p>
          <Link href="/products" style={{
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: '0.875rem',
            marginTop: '1rem',
            display: 'inline-block'
          }}>
            返回产品列表
          </Link>
        </div>
      </div>
    );
  }

  const handleInvest = () => {
    // 检查实名认证
    if (!isVerified) {
      setErrorMessage('请先完成实名认证才能进行投资');
      return;
    }

    // 跳转到投资确认页面
    window.location.href = `/invest/confirm?productId=${product.id}&amount=${product.min}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: '6rem' }}>
      {/* 顶部导航 */}
      <div style={{
        background: '#3b82f6',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}>
        <Link href="/products" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
          {product.title}
        </h1>
      </div>

      {/* 产品信息 */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        padding: '1.5rem',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {product.rate}%
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>日收益率</div>
        </div>

        {/* 进度条 */}
        <div style={{ marginBottom: '2rem', paddingBottom: '1rem' }}>
          <div style={{
            width: '100%',
            height: '0.5rem',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '0.25rem',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '0.75rem'
          }}>
            <div style={{
              width: `${product.percent}%`,
              height: '100%',
              background: 'white',
              borderRadius: '0.25rem',
              position: 'relative',
              transition: 'width 0.3s ease'
            }}>
              <div style={{
                position: 'absolute',
                right: '-0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '1rem',
                height: '1rem',
                background: 'white',
                borderRadius: '50%',
                boxShadow: '0 0 0 0.25rem rgba(255, 255, 255, 0.3)'
              }}></div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.875rem',
            opacity: 0.9
          }}>
            <span>募集进度</span>
            <span style={{ fontWeight: 600 }}>已售{product.percent}%</span>
          </div>
        </div>

        {/* 投资信息 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              30分钟
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>投资周期</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              到期自动续回
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>还本方式</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              ¥{product.min}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>起投金额</div>
          </div>
        </div>


        {/* 担保机构 */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem',
            overflow: 'hidden'
          }}>
            <img 
              src="/n_v1bkuymc75umdvmzcsanfq-3314720712.jpg" 
              alt="担保机构图标" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            fontSize: '0.875rem', 
            color: '#111827' 
          }}>
            <span style={{ marginRight: '0.5rem' }}>担保机构:</span>
            <img 
              src="/footer-picc-logo.png" 
              alt="担保机构logo" 
              style={{
                height: '3rem',
                maxWidth: '16rem',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div style={{
        background: 'white',
        marginTop: '0.5rem'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <button
            onClick={() => setActiveTab(1)}
            style={{
              flex: 1,
              padding: '1rem',
              border: 'none',
              background: 'transparent',
              color: activeTab === 1 ? '#3b82f6' : '#6b7280',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === 1 ? '2px solid #3b82f6' : '2px solid transparent'
            }}
          >
            项目详情
          </button>
          <button
            onClick={() => setActiveTab(2)}
            style={{
              flex: 1,
              padding: '1rem',
              border: 'none',
              background: 'transparent',
              color: activeTab === 2 ? '#3b82f6' : '#6b7280',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === 2 ? '2px solid #3b82f6' : '2px solid transparent'
            }}
          >
            收益规则
          </button>
          <button
            onClick={() => setActiveTab(3)}
            style={{
              flex: 1,
              padding: '1rem',
              border: 'none',
              background: 'transparent',
              color: activeTab === 3 ? '#3b82f6' : '#6b7280',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === 3 ? '2px solid #3b82f6' : '2px solid transparent'
            }}
          >
            安全保障
          </button>
        </div>

        {/* 内容区域 */}
        <div style={{ padding: '1rem' }}>
          {activeTab === 1 && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>项目规模：</div>
                <div style={{ fontSize: '0.875rem', color: '#111827' }}>¥{product.total}</div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>结算方式：</div>
                <div style={{ fontSize: '0.875rem', color: '#111827' }}>{product.settlement_method}</div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>投资零风险：</div>
                <div style={{ fontSize: '0.875rem', color: '#111827' }}>{product.risk_level}</div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>资金用途：</div>
                <div style={{ fontSize: '0.875rem', color: '#111827' }}>{product.fund_usage}</div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>收益计算规则：</strong>
                </p>
                <p style={{ marginBottom: '0.5rem' }}>• 按分钟计算收益，每分钟收益 = 投资金额 × 分钟收益率</p>
                <p style={{ marginBottom: '0.5rem' }}>• 收益每日结算，次日到账</p>
                <p style={{ marginBottom: '0.5rem' }}>• 到期自动赎回，本金和收益一次性到账</p>
                <p style={{ marginBottom: '1rem' }}>• 提前赎回将按实际持有分钟数计算收益</p>
                
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div>
              <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: 1.6 }}>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>安全保障措施：</strong>
                </p>
                <p style={{ marginBottom: '0.5rem' }}>• 资金由第三方银行托管，确保资金安全</p>
                <p style={{ marginBottom: '0.5rem' }}>• 提供基金托管服务，专业机构管理</p>
                <p style={{ marginBottom: '0.5rem' }}>• 担保机构：{product.guarantor}</p>
                <p style={{ marginBottom: '1rem' }}>• 严格的风控体系，多重安全保障</p>
                
                <p style={{ marginBottom: '1rem' }}>
                  <strong>合规说明：</strong>
                </p>
                <p style={{ marginBottom: '0.5rem' }}>• 平台已获得相关金融牌照</p>
                <p style={{ marginBottom: '0.5rem' }}>• 严格遵守国家金融监管政策</p>
                <p>• 定期接受监管部门的检查和审计</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 投资按钮 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        padding: '1rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        {/* 错误提示 */}
        {errorMessage && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '0.75rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc2626',
                fontSize: '1.25rem',
                cursor: 'pointer',
                padding: 0,
                lineHeight: 1
              }}
            >
              ×
            </button>
          </div>
        )}
        <button
          onClick={handleInvest}
          disabled={!isVerified || checkingVerification || isProductClosed}
          style={{
            width: '100%',
            height: '3rem',
            background: (!isVerified || checkingVerification || isProductClosed) ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: (!isVerified || checkingVerification || isProductClosed) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          {checkingVerification ? '检查中...' : isProductClosed ? '产品已关闭' : !isVerified ? '请先完成实名认证' : '立即投资'}
        </button>
      </div>

      {/* 底部间距 */}
      <div style={{ height: '8rem' }}></div>
    </div>
  );
}

