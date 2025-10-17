'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface UsdtAddress {
  id: number;
  address: string;
  network: string;
  label: string;
  is_default: boolean;
  created_at: string;
}

export default function UsdtAddressPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [usdtAddresses, setUsdtAddresses] = useState<UsdtAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: '',
    network: 'TRC20',
    label: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 使用useEffect处理重定向
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // 获取USDT地址列表
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchUsdtAddresses = async () => {
      try {
        const { data, error } = await supabase
          .from('usdt_addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('获取USDT地址失败:', error);
          return;
        }

        setUsdtAddresses(data || []);
      } catch (err) {
        console.error('获取USDT地址失败:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsdtAddresses();
  }, [isAuthenticated, user]);

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

  const handleAddAddress = async () => {
    if (!newAddress.address || !newAddress.network) {
      setError('请填写完整信息');
      return;
    }

    // 简单的USDT地址格式验证
    if (newAddress.network === 'TRC20' && !newAddress.address.startsWith('T')) {
      setError('TRC20地址格式不正确');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('usdt_addresses')
        .insert({
          user_id: user?.id,
          address: newAddress.address,
          network: newAddress.network,
          label: newAddress.label || 'USDT地址',
          is_default: usdtAddresses.length === 0 // 如果是第一个地址，设为默认
        });

      if (error) {
        throw error;
      }

      // 刷新USDT地址列表
      const { data: updatedAddresses, error: fetchError } = await supabase
        .from('usdt_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (!fetchError) {
        setUsdtAddresses(updatedAddresses || []);
      }

      setShowAddForm(false);
      setNewAddress({ address: '', network: 'TRC20', label: '' });
    } catch (err) {
      setError('添加USDT地址失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      // 先取消所有默认状态
      await supabase
        .from('usdt_addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // 设置新的默认地址
      await supabase
        .from('usdt_addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      // 刷新列表
      const { data, error } = await supabase
        .from('usdt_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (!error) {
        setUsdtAddresses(data || []);
      }
    } catch (err) {
      console.error('设置默认地址失败:', err);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm('确定要删除这个USDT地址吗？')) return;

    try {
      const { error } = await supabase
        .from('usdt_addresses')
        .delete()
        .eq('id', addressId);

      if (error) {
        throw error;
      }

      // 刷新列表
      const { data, error: fetchError } = await supabase
        .from('usdt_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (!fetchError) {
        setUsdtAddresses(data || []);
      }
    } catch (err) {
      console.error('删除USDT地址失败:', err);
    }
  };

  const formatAddress = (address: string) => {
    if (address.length <= 8) return address;
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  const getNetworkIcon = (network: string) => {
    // 根据网络类型返回对应的颜色
    if (network === 'TRC20') return '#ff6b35';
    if (network === 'ERC20') return '#627eea';
    if (network === 'BEP20') return '#f0b90b';
    return '#3b82f6';
  };

  if (isLoading) {
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
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>加载中...</p>
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
        <Link href="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>USDT地址管理</h1>
      </div>

      <div style={{ padding: '1rem' }}>
        {/* USDT地址列表 */}
        {usdtAddresses.length > 0 ? (
          <div style={{ marginBottom: '1.5rem' }}>
            {usdtAddresses.map((address) => (
              <div
                key={address.id}
                style={{
                  background: 'white',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
                  border: address.is_default ? '2px solid #3b82f6' : '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      background: getNetworkIcon(address.network),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>
                        {address.network.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>
                        {address.network}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {formatAddress(address.address)}
                      </div>
                    </div>
                  </div>
                  {address.is_default && (
                    <div style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}>
                      默认
                    </div>
                  )}
                </div>
                
                <div style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '1rem' }}>
                  <div style={{ marginBottom: '0.25rem' }}>标签：{address.label}</div>
                  <div style={{ marginBottom: '0.25rem', wordBreak: 'break-all' }}>地址：{address.address}</div>
                  <div style={{ color: '#6b7280' }}>绑定时间：{new Date(address.created_at).toLocaleDateString()}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: '#f3f4f6',
                        color: '#6b7280',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      设为默认
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              background: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#9ca3af' }}>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              暂未绑定USDT地址
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              立即绑定
            </button>
          </div>
        )}

        {/* 添加USDT地址按钮 */}
        {usdtAddresses.length > 0 && (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'white',
              color: '#3b82f6',
              border: '2px dashed #3b82f6',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '1.5rem'
            }}
          >
            + 添加USDT地址
          </button>
        )}

        {/* 添加USDT地址表单 */}
        {showAddForm && (
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
              添加USDT地址
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                网络类型
              </label>
              <select
                value={newAddress.network}
                onChange={(e) => setNewAddress({ ...newAddress, network: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="TRC20">TRC20 (推荐)</option>
                <option value="ERC20">ERC20</option>
                <option value="BEP20">BEP20</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                USDT地址
              </label>
              <input
                type="text"
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                placeholder="请输入USDT地址"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                地址标签（可选）
              </label>
              <input
                type="text"
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                placeholder="给这个地址起个名字"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewAddress({ address: '', network: 'TRC20', label: '' });
                  setError('');
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={handleAddAddress}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: isSubmitting ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? '添加中...' : '确认添加'}
              </button>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1rem',
          boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
            使用说明
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.5' }}>
            <div style={{ marginBottom: '0.25rem' }}>• 绑定USDT地址用于充值和提款</div>
            <div style={{ marginBottom: '0.25rem' }}>• 请确保USDT地址准确无误</div>
            <div style={{ marginBottom: '0.25rem' }}>• 推荐使用TRC20网络（手续费低）</div>
            <div style={{ marginBottom: '0.25rem' }}>• 可以设置一个默认地址</div>
            <div>• 如有疑问，请联系客服</div>
          </div>
        </div>
      </div>
    </div>
  );
}
