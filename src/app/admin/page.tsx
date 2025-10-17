'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentUsers: any[];
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 获取用户总数
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // 获取产品总数
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // 获取订单总数
      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // 获取总收入
      const { data: financeData } = await supabase
        .from('finance')
        .select('money')
        .eq('type', 1); // 收入类型

      const totalRevenue = financeData?.reduce((sum, item) => sum + Number(item.money), 0) || 0;

      // 获取最近用户
      const { data: recentUsers } = await supabase
        .from('users')
        .select('id, phone, created_at, money')
        .order('created_at', { ascending: false })
        .limit(5);

      // 获取最近订单
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('id, user_id, money, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: userCount || 0,
        totalProducts: productCount || 0,
        totalOrders: orderCount || 0,
        totalRevenue,
        recentUsers: recentUsers || [],
        recentOrders: recentOrders || []
      });
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>正在加载数据...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>仪表盘</h1>
      
      {/* 统计卡片 */}
      <div className="dashboard-stats">
        <div className="stat-card users">
          <div className="stat-header">
            <div className="stat-title">用户总数</div>
            <div className="stat-icon users">
              <i className="material-icons">people</i>
            </div>
          </div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-change">
            <i className="material-icons">trending_up</i>
            较昨日 +12
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-header">
            <div className="stat-title">产品总数</div>
            <div className="stat-icon products">
              <i className="material-icons">inventory</i>
            </div>
          </div>
          <div className="stat-value">{stats.totalProducts}</div>
          <div className="stat-change">
            <i className="material-icons">trending_up</i>
            较昨日 +3
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-header">
            <div className="stat-title">订单总数</div>
            <div className="stat-icon orders">
              <i className="material-icons">shopping_cart</i>
            </div>
          </div>
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-change">
            <i className="material-icons">trending_up</i>
            较昨日 +8
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-header">
            <div className="stat-title">总收入</div>
            <div className="stat-icon revenue">
              <i className="material-icons">account_balance</i>
            </div>
          </div>
          <div className="stat-value">¥{stats.totalRevenue.toFixed(2)}</div>
          <div className="stat-change">
            <i className="material-icons">trending_up</i>
            较昨日 +5.2%
          </div>
        </div>
      </div>

      {/* 最近用户 */}
      <div className="data-table">
        <div className="table-header">
          <h3 className="table-title">最近注册用户</h3>
        </div>
        <div className="table-content">
          <table>
            <thead>
              <tr>
                <th>用户ID</th>
                <th>手机号</th>
                <th>余额</th>
                <th>注册时间</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.phone}</td>
                  <td>¥{Number(user.money).toFixed(2)}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 最近订单 */}
      <div className="data-table">
        <div className="table-header">
          <h3 className="table-title">最近订单</h3>
        </div>
        <div className="table-content">
          <table>
            <thead>
              <tr>
                <th>订单ID</th>
                <th>用户ID</th>
                <th>金额</th>
                <th>状态</th>
                <th>创建时间</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user_id}</td>
                  <td>¥{Number(order.money).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${
                      order.status === 0 ? 'status-pending' :
                      order.status === 1 ? 'status-active' :
                      order.status === 2 ? 'status-completed' : 'status-cancelled'
                    }`}>
                      {order.status === 0 ? '待处理' :
                       order.status === 1 ? '已发货' :
                       order.status === 2 ? '已完成' : '已取消'}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}