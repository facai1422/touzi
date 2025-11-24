import { supabase } from './supabase';

export interface AdminUser {
  id: number;
  username: string;
  name?: string;
  email?: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export const adminAuthService = {
  // 管理员登录
  async login(username: string, password: string): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('password', password) // 在实际应用中应该使用加密密码
      .eq('status', 1) // 只允许活跃的管理员
      .single();

    if (error || !data) {
      throw new Error('管理员账号或密码错误');
    }

    // 更新最后登录时间
    await supabase
      .from('admin_users')
      .update({ 
        login_at: new Date().toISOString(),
        login_ip: '127.0.0.1',
        login_num: (data.login_num || 0) + 1
      })
      .eq('id', data.id);

    return {
      id: data.id,
      username: data.username,
      name: data.description || '管理员',
      email: data.mail,
      role: data.authorize === '3' ? 'super_admin' : 'admin',
      is_active: data.status === 1,
      last_login: data.login_at,
      created_at: data.created_at
    };
  },

  // 修改密码
  async changePassword(adminId: number, oldPassword: string, newPassword: string): Promise<void> {
    // 验证旧密码
    const { data: admin, error: checkError } = await supabase
      .from('admin_users')
      .select('password')
      .eq('id', adminId)
      .single();

    if (checkError || !admin) {
      throw new Error('管理员不存在');
    }

    if (admin.password !== oldPassword) {
      throw new Error('原密码错误');
    }

    // 更新密码
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ 
        password: newPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', adminId);

    if (updateError) {
      throw new Error('密码修改失败');
    }
  },

  // 获取管理员信息
  async getAdminInfo(adminId: number): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', adminId)
      .single();

    if (error || !data) {
      throw new Error('获取管理员信息失败');
    }

    return {
      id: data.id,
      username: data.username,
      name: data.description || '管理员',
      email: data.mail,
      role: data.authorize === '3' ? 'super_admin' : 'admin',
      is_active: data.status === 1,
      last_login: data.login_at,
      created_at: data.created_at
    };
  }
};
