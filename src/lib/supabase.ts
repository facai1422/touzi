import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfcbxphhesbhazmjaztj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmY2J4cGhoZXNiaGF6bWphenRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzA2MDQsImV4cCI6MjA3NjIwNjYwNH0.Fe3NMFJn8_rQDRbIKEc-SwLTC2Zj9AyVLtwJZF4IlVY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// 用户相关操作
export const userService = {
  // 用户登录
  async login(phone: string, password: string) {
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

    return data;
  },

  // 用户注册
  async register(userData: {
    phone: string;
    password: string;
    inviteCode?: string;
  }) {
    // 检查用户是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone', userData.phone)
      .single();

    if (existingUser) {
      throw new Error('该账号已注册');
    }

    // 验证邀请码
    let topId = null;
    if (userData.inviteCode) {
      const { data: inviteUser } = await supabase
        .from('users')
        .select('id')
        .eq('phone', userData.inviteCode)
        .single();

      if (!inviteUser) {
        throw new Error('无效邀请人');
      }
      topId = inviteUser.id;
    }

    // 创建新用户
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        phone: userData.phone,
        password: userData.password,
        top_id: topId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      throw new Error('注册失败，请重试');
    }

    // 添加注册奖励
    await this.addReward(newUser.id, 10.00, '注册奖励', '注册成功，系统赠送10元');

    return newUser;
  },

  // 添加奖励
  async addReward(userId: number, amount: number, reason: string, description: string) {
    // 获取用户当前余额
    const { data: user } = await supabase
      .from('users')
      .select('money')
      .eq('id', userId)
      .single();

    const beforeBalance = user?.money || 0;
    const afterBalance = beforeBalance + amount;

    // 添加财务流水
    await supabase
      .from('finance')
      .insert({
        user_id: userId,
        money: amount,
        type: 1, // 奖励类型
        reason: reason,
        before_balance: beforeBalance,
        after_balance: afterBalance,
        zh_cn: description,
        created_at: new Date().toISOString()
      });

    // 更新用户余额
    await supabase
      .from('users')
      .update({
        money: afterBalance,
        reward: amount
      })
      .eq('id', userId);
  }
};
