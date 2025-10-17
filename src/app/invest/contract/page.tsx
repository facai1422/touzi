'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: number;
  name: string;
  interest_rate: number;
  duration_days: number;
  min_amount: number;
  max_amount: number;
  total_amount: number;
  invested_amount: number;
  description: string;
}

interface UserVerification {
  real_name: string;
  id_card: string;
}

export default function ContractPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const amount = searchParams.get('amount');
  const investmentId = searchParams.get('investmentId');

  const [product, setProduct] = useState<Product | null>(null);
  const [userVerification, setUserVerification] = useState<UserVerification | null>(null);
  const [contractNumber, setContractNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (investmentId) {
      // 通过投资ID访问，不需要productId和amount
    } else if (!productId || !amount) {
      router.push('/products');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        let productData;
        
        if (investmentId) {
          // 通过投资ID获取产品信息
          const { data: investmentData, error: investmentError } = await supabase
            .from('user_investments')
            .select(`
              amount,
              start_date,
              end_date,
              investment_projects (*)
            `)
            .eq('id', parseInt(investmentId))
            .eq('user_id', user?.id)
            .single();

          if (investmentError) {
            console.error('获取投资信息失败:', investmentError);
            router.push('/investments');
            return;
          }

          productData = investmentData.investment_projects;
          setProduct({
            ...productData,
            min_amount: investmentData.amount,
            max_amount: investmentData.amount
          });
        } else {
          // 获取产品信息
          const { data, error: productError } = await supabase
            .from('investment_projects')
            .select('*')
            .eq('id', parseInt(productId))
            .single();

          if (productError) {
            console.error('获取产品信息失败:', productError);
            router.push('/products');
            return;
          }

          productData = data;
          setProduct(productData);
        }

        // 获取用户实名认证信息
        const { data: verificationData, error: verificationError } = await supabase
          .from('user_verifications')
          .select('real_name, id_card')
          .eq('user_id', user?.id)
          .eq('status', 1)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (verificationError) {
          console.error('获取实名认证信息失败:', verificationError);
        }

        if (verificationData) {
          setUserVerification(verificationData);
        } else {
          // 如果没有认证记录，从用户表获取
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('real_name, idcard')
            .eq('id', user?.id)
            .single();

          if (userData && userData.real_name) {
            setUserVerification({
              real_name: userData.real_name,
              id_card: userData.idcard || ''
            });
          }
        }

        // 生成合同编号
        const contractNum = generateContractNumber();
        setContractNumber(contractNum);

      } catch (error) {
        console.error('获取数据失败:', error);
        router.push('/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, amount, user?.id, router]);

  const generateContractNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}${random}`;
  };

  const maskIdCard = (idCard: string) => {
    if (!idCard || idCard.length < 8) return idCard;
    const start = idCard.substring(0, 4);
    const end = idCard.substring(idCard.length - 4);
    const middle = '*'.repeat(idCard.length - 8);
    return `${start}${middle}${end}`;
  };

  const calculateTotalReturn = () => {
    if (!product || !amount) return 0;
    const investmentAmount = parseFloat(amount);
    const dailyRate = product.interest_rate / 100;
    const duration = product.duration_days;
    const interest = investmentAmount * dailyRate * duration;
    return investmentAmount + interest;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
  };

  if (loading || isLoading) {
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
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>正在加载合同...</p>
        </div>
      </div>
    );
  }

  if (!product || !userVerification) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>数据加载失败</p>
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

  const investmentAmount = parseFloat(amount || '0');
  const totalReturn = calculateTotalReturn();
  const currentDate = new Date();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 顶部导航 */}
      <div style={{
        background: '#ef4444',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}>
        <Link href={investmentId ? `/investments/${investmentId}` : `/invest/confirm?productId=${productId}&amount=${amount}`} style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>担保合同</h1>
      </div>

      {/* 合同内容 */}
        <div style={{
          background: 'white',
          margin: '0.5rem',
          borderRadius: '0.5rem',
          padding: '1rem',
          paddingBottom: '8rem' // 为固定按钮和印章留出更多空间
        }}>
        {/* 合同标题 */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem 0' }}>
            北京世桥生物制药有限公司
          </h2>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>
            投资合同书
          </h3>
          <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
            <span style={{ color: '#3b82f6', fontSize: '0.875rem' }}>
              合同编号: {contractNumber}
            </span>
          </div>
        </div>

        {/* 合同主体 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#111827' }}>甲方(投资方):</span>
              <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
                {userVerification.real_name}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#111827' }}>乙方(管理方):</span>
              <span style={{ fontSize: '0.875rem', color: '#111827' }}>北京世桥生物制药有限公司</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: '#111827' }}>丙方(担保方):</span>
              <span style={{ fontSize: '0.875rem', color: '#111827' }}>中国人民财产保险股份有限公司</span>
            </div>
          </div>

          <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.5', marginBottom: '1rem' }}>
            甲乙丙双方经友好协商,本着平等自愿、诚实信用的原则,就甲方使用乙方提供的本网站所有服务的有关事项达成如下协议:
          </div>

          {/* 投资明细 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>
              一、理财投资明细
            </h4>
            
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>产品名称</span>
                <span style={{ fontSize: '0.875rem', color: '#111827' }}>{product.name}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>投资人姓名</span>
                <span style={{ fontSize: '0.875rem', color: '#111827' }}>{userVerification.real_name}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>投资人身份证</span>
                <span style={{ fontSize: '0.875rem', color: '#111827' }}>{maskIdCard(userVerification.id_card)}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>投入本金数额</span>
                <span style={{ fontSize: '0.875rem', color: '#111827' }}>{investmentAmount.toFixed(2)}元</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>限时</span>
                <span style={{ fontSize: '0.875rem', color: '#111827' }}>30分钟</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>预期收益率</span>
                <span style={{ fontSize: '0.875rem', color: '#111827' }}>{product.interest_rate}%</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>应收本息(元)</span>
                <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>{totalReturn.toFixed(2)}元</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>还款方式</span>
                <span style={{ fontSize: '0.875rem', color: '#111827' }}>到期还本付息</span>
              </div>
            </div>
          </div>

          {/* 合同条款 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.6', marginBottom: '1rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>二、</strong>理财期未满,甲方不得擅自终止本协议,否则,乙方将取消为甲方的理财服务,甲方不享受任何理财收益,甲方投资时必须看清楚投资项目的一切事宜，按照公司要求进行投资，如有违反规定，甲方并承担由此所引起的一切损失。
              </p>
              
              <p style={{ marginBottom: '1rem' }}>
                <strong>三、</strong>理财方式以网络投资平台的形式进行合作。理财金由甲方帐户划转到乙方的综合理财帐户上进行具体的理财操作,由于甲方全权委托乙方理财,因此在股权,房地产土地,矿权,新能源,石油,等其它实业的投资风险由乙方承担,乙方首先要考虑资金的安全性,然后才考虑资金的收益。甲方不得以任何形式干预乙方的理财操作。收益是每天发放到甲方账户，待理财投资周期到日止，乙方应将甲方之理财本金划入其在乙方开立的存款帐户上。
              </p>
              
              <p style={{ marginBottom: '1rem' }}>
                <strong>四、</strong>乙方对甲方投资资金负有控制风险的责任,必须勤勉尽责。如果投资有亏损情况,则无论亏损大小由乙方承担全部损失,按合同承诺付款给甲方。如果乙方出现违约将由担保方丙方履行承诺付款给甲方。
              </p>
              
              <p style={{ marginBottom: '1rem' }}>
                <strong>五、</strong>保密义务甲乙双方对其通过接触和通过其他渠道得知的有关各方的商业机密等严格保密,对所有资料严格保密,不得向任何其他人员及机构透露。个人的信息。
              </p>
              
              <p style={{ marginBottom: '1rem' }}>
                <strong>六、</strong>合同生效 1、本协议经投资人通过投资平台点击确认投资后自动生成并签订,本协议自生成时生效。 2、本协议履行期间，各方如发生争议或者纠纷，应友好协商解决；如协商不成，任何一方有权向乙方所在地人民法院起诉。 3、 本协议采用电子文本形式制成，各方均认可该形式的法律效力。
              </p>
              
              <p>
                <strong>七、</strong>理财协议一式三份，乙方一份，甲方一份，丙方一份，具有同等法律效力。
              </p>
            </div>
          </div>
        </div>

        {/* 签署信息 */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          {/* 甲方和乙方在同一行 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            {/* 甲方 */}
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600, marginBottom: '0.5rem' }}>
                甲方: {userVerification.real_name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                日期: {formatDate(currentDate)}
              </div>
            </div>
            
            {/* 乙方 */}
            <div style={{ flex: 1, textAlign: 'left', position: 'relative' }}>
              <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600, marginBottom: '0.5rem' }}>
                乙方: 北京世桥生物制药有限公司
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                日期: {formatDate(currentDate)}
              </div>
              {/* 乙方印章 */}
              <div style={{
                position: 'absolute',
                top: '-3rem',
                right: '0.5rem',
                width: '6rem',
                height: '6rem',
                zIndex: 0
              }}>
                <img 
                  src="/4fe5ba5ce1a7cfe8ca8f7338a9602cc6.png" 
                  alt="乙方印章"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* 丙方单独一行 */}
          <div style={{ textAlign: 'left', position: 'relative' }}>
            <div style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600, marginBottom: '0.5rem' }}>
              丙方: 中国人民财产保险股份有限公司
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              日期: {formatDate(currentDate)}
            </div>
            {/* 丙方印章 */}
            <div style={{
              position: 'absolute',
              top: '-3rem',
              left: '6rem',
              width: '6rem',
              height: '6rem',
              zIndex: 0
            }}>
              <img 
                src="/4bb79806ef76576e5aea241e64f0de3c.png" 
                alt="丙方印章"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 确认按钮 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1rem',
        background: 'white',
        borderTop: '1px solid #e5e7eb'
      }}>
        <button
          onClick={() => {
            // 这里可以添加投资确认逻辑
            alert('投资确认成功！');
            router.push('/profile');
          }}
          style={{
            width: '100%',
            height: '3rem',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          确认投资
        </button>
      </div>
    </div>
  );
}
