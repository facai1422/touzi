'use client';

import { useState, useEffect, Suspense } from 'react';
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

function InvestmentConfirmPageContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const amount = searchParams.get('amount');

  const [product, setProduct] = useState<Product | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>(amount || '');
  const [isLoading, setIsLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!productId) {
      router.push('/products');
      return;
    }

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('investment_projects')
          .select('*')
          .eq('id', parseInt(productId))
          .single();

        if (error) {
          console.error('获取产品信息失败:', error);
          router.push('/products');
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('获取产品信息失败:', error);
        router.push('/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleAmountChange = (value: string) => {
    setInvestmentAmount(value);
  };

  const handleMaxAmount = () => {
    if (user?.money) {
      setInvestmentAmount(user.money.toString());
    }
  };

  const calculateExpectedReturn = () => {
    if (!product || !investmentAmount) return 0;
    const amount = parseFloat(investmentAmount);
    const dailyRate = product.interest_rate / 100;
    const duration = product.duration_days;
    return amount * dailyRate * duration;
  };

  const handleInvest = async () => {
    if (!product || !investmentAmount || !agreed) return;

    try {
      const amount = parseFloat(investmentAmount);
      
      // 检查投资金额
      if (amount < product.min_amount) {
        alert(`投资金额不能少于${product.min_amount}元`);
        return;
      }
      
      if (amount > product.max_amount) {
        alert(`投资金额不能超过${product.max_amount}元`);
        return;
      }

      if (amount > (user?.money || 0)) {
        alert('投资金额不能超过可用余额');
        return;
      }

      // 跳转到担保合同页面
      router.push(`/invest/contract?productId=${productId}&amount=${amount}`);
    } catch (error) {
      console.error('投资处理失败:', error);
      alert('投资处理失败，请重试');
    }
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
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>正在加载...</p>
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

  const expectedReturn = calculateExpectedReturn();

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* 顶部导航 */}
      <div style={{
        background: '#3b82f6',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}>
        <Link href={`/products/${productId}`} style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>投资确认</h1>
      </div>

      {/* 产品信息 */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        padding: '1.5rem',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {product.interest_rate}%
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>日收益率</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              30分钟
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>认购期限</div>
          </div>
        </div>
      </div>

      {/* 投资金额输入 */}
      <div style={{
        background: 'white',
        margin: '0.5rem',
        borderRadius: '0.5rem',
        padding: '1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#333' }}>投资金额</span>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            可用余额 {user?.money?.toFixed(2) || '0.00'} 元
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #d1d5db',
          borderRadius: '0.375rem',
          padding: '0.75rem'
        }}>
          <input
            type="number"
            value={investmentAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="请输入投资金额"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: '#333'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleMaxAmount}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              全部
            </button>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>元</span>
          </div>
        </div>

        {/* 投资详情 */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>起购金额</span>
            <span style={{ fontSize: '0.875rem', color: '#333' }}>{product.min_amount.toFixed(2)}元</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>最大可投</span>
            <span style={{ fontSize: '0.875rem', color: '#333' }}>{product.max_amount.toFixed(2)}元</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem 0',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>返本方式</span>
            <span style={{ fontSize: '0.875rem', color: '#333' }}>到期自动返本</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.5rem 0'
          }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>估算收益</span>
            <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>
              {expectedReturn.toFixed(2)}元
            </span>
          </div>
        </div>
      </div>

      {/* 协议同意 */}
      <div style={{
        background: 'white',
        margin: '0.5rem',
        borderRadius: '0.5rem',
        padding: '1rem'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ marginRight: '0.5rem' }}
          />
          我已了解并同意
          <Link href={`/invest/contract?productId=${productId}&amount=${investmentAmount}`} style={{
            color: '#3b82f6',
            textDecoration: 'none',
            margin: '0 0.25rem'
          }}>
            《担保合同》
          </Link>
        </label>
      </div>

      {/* 投资按钮 */}
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
          onClick={handleInvest}
          disabled={!agreed || !investmentAmount}
          style={{
            width: '100%',
            height: '3rem',
            background: agreed && investmentAmount ? '#3b82f6' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: agreed && investmentAmount ? 'pointer' : 'not-allowed'
          }}
        >
          立即投资
        </button>
      </div>
    </div>
  );
}

export default function InvestmentConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvestmentConfirmPageContent />
    </Suspense>
  );
}
