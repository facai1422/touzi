'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface VerificationData {
  real_name: string;
  id_card: string;
  id_card_front: string;
  id_card_back: string;
}

export default function VerificationPage() {
  const { user, isAuthenticated, loading, updateUserInfo } = useAuth();
  const router = useRouter();
  const [verificationData, setVerificationData] = useState<VerificationData>({
    real_name: '',
    id_card: '',
    id_card_front: '',
    id_card_back: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // 检查认证状态
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [loading, isAuthenticated, router]);

  // 检查是否已经实名认证
  useEffect(() => {
    if (user && user.auth === 1) {
      router.push('/verify/success');
      return;
    }
  }, [user, router]);

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

  // 如果已经实名认证，重定向到成功页面
  if (user?.auth === 1) {
    return null;
  }

  const handleInputChange = (field: keyof VerificationData, value: string) => {
    setVerificationData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleFileUpload = async (field: 'id_card_front' | 'id_card_back', file: File) => {
    try {
      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('不支持的文件类型，请上传图片文件');
      }

      // 验证文件大小（10MB限制）
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('文件大小不能超过10MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}_${field}_${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('verification')
        .upload(filePath, file);

      if (uploadError) {
        console.error('文件上传错误:', uploadError);
        throw new Error(uploadError.message || '文件上传失败');
      }

      const { data } = supabase.storage
        .from('verification')
        .getPublicUrl(filePath);

      setVerificationData(prev => ({
        ...prev,
        [field]: data.publicUrl
      }));

      // 清除之前的错误信息
      setError('');
    } catch (err: unknown) {
      console.error('文件上传失败:', err);
      setError(err instanceof Error ? err.message : '文件上传失败，请重试');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // 验证表单数据
      if (!verificationData.real_name.trim()) {
        throw new Error('请输入真实姓名');
      }
      if (!verificationData.id_card.trim()) {
        throw new Error('请输入身份证号码');
      }
      if (!verificationData.id_card_front) {
        throw new Error('请上传身份证正面照片');
      }
      if (!verificationData.id_card_back) {
        throw new Error('请上传身份证背面照片');
      }

      // 验证身份证号码格式 - 简化版本
      const validateIdCard = (idCard: string) => {
        // 去除空格和特殊字符
        const cleanIdCard = idCard.replace(/\s/g, '').toUpperCase();
        
        console.log('验证身份证号码:', cleanIdCard);
        
        // 基本格式检查：18位数字，最后一位可能是X
        if (!/^\d{17}[\dX]$/.test(cleanIdCard)) {
          console.log('身份证号码基本格式检查失败:', cleanIdCard);
          return false;
        }
        
        // 只检查基本格式，不进行复杂的日期验证
        console.log('身份证号码验证通过:', cleanIdCard);
        return true;
      };
      
      if (!validateIdCard(verificationData.id_card)) {
        throw new Error('身份证号码格式不正确，请检查输入');
      }

      // 提交实名认证申请
      const { error: insertError } = await supabase
        .from('user_verifications')
        .insert({
          user_id: user?.id,
          real_name: verificationData.real_name.trim(),
          id_card: verificationData.id_card.trim(),
          id_card_front: verificationData.id_card_front,
          id_card_back: verificationData.id_card_back,
          status: 0 // 待审核
        });

      if (insertError) {
        throw insertError;
      }

      // 同时更新用户表的基本信息（用于演示，实际应该等审核通过后再更新）
      const { error: updateError } = await supabase
        .from('users')
        .update({
          real_name: verificationData.real_name.trim(),
          idcard: verificationData.id_card.trim(),
          auth: 1, // 直接设置为已认证（演示用）
          verification_status: 1,
          verified_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (updateError) {
        console.warn('更新用户信息失败:', updateError);
      }

      // 更新本地用户信息
      if (user?.id) {
        await updateUserInfo(user.id);
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        {/* 顶部导航 */}
        <div style={{
          background: '#ef4444',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          color: 'white'
        }}>
          <Link href="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>实名认证</h1>
        </div>

        {/* 成功页面内容 */}
        <div style={{
          background: '#fff',
          margin: '1rem',
          borderRadius: '0.75rem',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            background: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#111827',
            margin: '0 0 0.5rem 0'
          }}>实名认证申请已提交</h2>
          
          <p style={{
            color: '#6b7280',
            fontSize: '0.875rem',
            margin: '0 0 2rem 0',
            lineHeight: 1.5
          }}>
            您的实名认证申请已提交成功，我们将在1-3个工作日内完成审核，请耐心等待。
          </p>

          <div style={{
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
              <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span style={{ color: '#92400e', fontSize: '0.875rem' }}>
              审核期间，您的账户功能将正常使用
            </span>
          </div>

          <Link href="/profile" style={{
            display: 'inline-block',
            background: '#ef4444',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            返回我的账户
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* 顶部导航 */}
      <div style={{
        background: '#ef4444',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}>
        <Link href="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>实名认证</h1>
      </div>

      <div style={{ padding: '1rem' }}>
        <form onSubmit={handleSubmit}>
          {/* 真实姓名 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              真实姓名 *
            </label>
            <input
              type="text"
              value={verificationData.real_name}
              onChange={(e) => handleInputChange('real_name', e.target.value)}
              placeholder="请输入您的真实姓名"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              required
            />
          </div>

          {/* 身份证号码 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              身份证号码 *
            </label>
            <input
              type="text"
              value={verificationData.id_card}
              onChange={(e) => handleInputChange('id_card', e.target.value)}
              placeholder="请输入您的身份证号码"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              required
            />
          </div>

          {/* 身份证正面 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              身份证正面 *
            </label>
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center',
              background: '#f9fafb'
            }}>
              {verificationData.id_card_front ? (
                <div>
                  <img
                    src={verificationData.id_card_front}
                    alt="身份证正面"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '120px',
                      borderRadius: '0.25rem',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <p style={{ color: '#10b981', fontSize: '0.875rem', margin: 0 }}>已上传</p>
                </div>
              ) : (
                <div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1" style={{ margin: '0 auto 0.5rem' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>点击上传身份证正面</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('id_card_front', file);
                    }}
                    style={{ display: 'none' }}
                    id="id_card_front"
                  />
                  <label
                    htmlFor="id_card_front"
                    style={{
                      display: 'inline-block',
                      background: '#3b82f6',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    选择文件
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 身份证背面 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              身份证背面 *
            </label>
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center',
              background: '#f9fafb'
            }}>
              {verificationData.id_card_back ? (
                <div>
                  <img
                    src={verificationData.id_card_back}
                    alt="身份证背面"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '120px',
                      borderRadius: '0.25rem',
                      marginBottom: '0.5rem'
                    }}
                  />
                  <p style={{ color: '#10b981', fontSize: '0.875rem', margin: 0 }}>已上传</p>
                </div>
              ) : (
                <div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1" style={{ margin: '0 auto 0.5rem' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>点击上传身份证背面</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('id_card_back', file);
                    }}
                    style={{ display: 'none' }}
                    id="id_card_back"
                  />
                  <label
                    htmlFor="id_card_back"
                    style={{
                      display: 'inline-block',
                      background: '#3b82f6',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    选择文件
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 错误信息 */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: isSubmitting ? '#9ca3af' : '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? '提交中...' : '提交实名认证'}
          </button>
        </form>

        {/* 说明信息 */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginTop: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#0369a1',
            margin: '0 0 0.5rem 0'
          }}>实名认证说明：</h3>
          <ul style={{
            fontSize: '0.75rem',
            color: '#0369a1',
            margin: 0,
            paddingLeft: '1rem'
          }}>
            <li>请确保身份证照片清晰可见</li>
            <li>身份证信息必须与注册信息一致</li>
            <li>我们将在1-3个工作日内完成审核</li>
            <li>审核通过后，您的账户将获得实名认证标识</li>
          </ul>
        </div>
      </div>
    </div>
  );
}