'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { adminAuthService, AdminUser } from '@/lib/adminAuth';

interface User {
  id: number;
  phone: string;
  name?: string;
  money: number;
  member_level: number;
  auth: number;
  created_at: string;
  real_name?: string; // 实名后的真实姓名
}

interface AuthContextType {
  user: User | null;
  admin: AdminUser | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserInfo: (userId: number) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 检查用户是否已登录
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 从localStorage获取用户信息
        const savedUser = localStorage.getItem('user');
        const savedAdmin = localStorage.getItem('admin');
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
        
        if (savedAdmin) {
          const adminData = JSON.parse(savedAdmin);
          setAdmin(adminData);
        }
      } catch (error) {
        console.error('检查认证状态失败:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (phone: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error || !data) {
        throw new Error('用户不存在');
      }

      if (data.password !== password) {
        throw new Error('密码错误');
      }

      if (data.clock === 1) {
        throw new Error('账号被锁定，请联系管理员');
      }

      // 更新登录时间
      await supabase
        .from('users')
        .update({ 
          login_time: new Date().toISOString(),
          ip: '127.0.0.1'
        })
        .eq('id', data.id);

      // 保存用户信息到localStorage
      const userData = {
        id: data.id,
        phone: data.phone,
        name: data.name,
        money: data.money,
        member_level: data.member_level,
        auth: data.auth,
        created_at: data.created_at,
        real_name: data.real_name
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: unknown) {
      throw error;
    }
  };

  const adminLogin = async (username: string, password: string) => {
    try {
      const adminData = await adminAuthService.login(username, password);
      localStorage.setItem('admin', JSON.stringify(adminData));
      setAdmin(adminData);
    } catch (error: unknown) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    setUser(null);
    setAdmin(null);
    router.push('/login');
  };

  // 更新用户信息（用于实名认证成功后更新显示）
  const updateUserInfo = async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('获取用户信息失败:', error);
        return;
      }

      if (data) {
        const userData = {
          id: data.id,
          phone: data.phone,
          name: data.name,
          money: data.money,
          member_level: data.member_level,
          auth: data.auth,
          created_at: data.created_at,
          real_name: data.real_name
        };

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      console.error('更新用户信息失败:', error);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = !!admin;

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      loading,
      login,
      adminLogin,
      logout,
      updateUserInfo,
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
