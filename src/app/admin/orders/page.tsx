'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Order {
  id: number;
  user_id: number;
  product_id: number;
  money: number;
  status: number;
  created_at: string;
  updated_at: string;
  user_phone?: string;
  product_title?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadOrders();
  }, [currentPage, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          users!inner(phone),
          products!inner(title_zh_cn)
        `, { count: 'exact' });

      // 搜索功能
      if (searchTerm) {
        query = query.or(`users.phone.ilike.%${searchTerm}%,products.title_zh_cn.ilike.%${searchTerm}%`);
      }

      // 状态筛选
      if (statusFilter !== 'all') {
        query = query.eq('status', parseInt(statusFilter));
      }

      // 分页
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error('加载订单数据失败:', error);
        return;
      }

      // 处理数据格式
      const processedOrders = data?.map(order => ({
        ...order,
        user_phone: order.users?.phone,
        product_title: order.products?.title_zh_cn
      })) || [];

      setOrders(processedOrders);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('加载订单数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadOrders();
  };

  const updateOrderStatus = async (orderId: number, newStatus: number) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('更新订单状态失败:', error);
        return;
      }

      loadOrders();
    } catch (error) {
      console.error('更新订单状态失败:', error);
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return '待处理';
      case 1: return '已发货';
      case 2: return '已完成';
      case 3: return '已取消';
      default: return '未知';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'warning';
      case 1: return 'info';
      case 2: return 'success';
      case 3: return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <h2>订单管理</h2>
        <p>管理所有用户订单</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="filter-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="搜索用户手机号或产品名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <i className="material-icons">search</i>
              搜索
            </button>
          </div>
        </form>
        
        <div className="filter-group">
          <label>订单状态：</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
            aria-label="订单状态筛选"
          >
            <option value="all">全部</option>
            <option value="0">待处理</option>
            <option value="1">已发货</option>
            <option value="2">已完成</option>
            <option value="3">已取消</option>
          </select>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="orders-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>正在加载订单数据...</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <div className="table-info">
                共 {orders.length} 个订单
              </div>
            </div>

            <div className="orders-table">
              <div className="table-header-row">
                <div className="col-id">订单ID</div>
                <div className="col-user">用户</div>
                <div className="col-product">产品</div>
                <div className="col-amount">金额</div>
                <div className="col-status">状态</div>
                <div className="col-date">下单时间</div>
                <div className="col-actions">操作</div>
              </div>

              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="table-row">
                    <div className="col-id">#{order.id}</div>
                    <div className="col-user">{order.user_phone}</div>
                    <div className="col-product">{order.product_title}</div>
                    <div className="col-amount">¥{order.money?.toFixed(2)}</div>
                    <div className="col-status">
                      <span className={`status-badge status-${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="col-date">{formatDate(order.created_at)}</div>
                    <div className="col-actions">
                      {order.status === 0 && (
                        <button
                          className="action-btn process"
                          onClick={() => updateOrderStatus(order.id, 1)}
                        >
                          <i className="material-icons">local_shipping</i>
                          发货
                        </button>
                      )}
                      {order.status === 1 && (
                        <button
                          className="action-btn complete"
                          onClick={() => updateOrderStatus(order.id, 2)}
                        >
                          <i className="material-icons">check_circle</i>
                          完成
                        </button>
                      )}
                      {(order.status === 0 || order.status === 1) && (
                        <button
                          className="action-btn cancel"
                          onClick={() => updateOrderStatus(order.id, 3)}
                        >
                          <i className="material-icons">cancel</i>
                          取消
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <i className="material-icons">shopping_cart</i>
                  <p>暂无订单数据</p>
                </div>
              )}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </button>
                
                <div className="page-info">
                  第 {currentPage} 页，共 {totalPages} 页
                </div>
                
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .orders-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h2 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .page-header p {
          color: #6c757d;
          margin: 0;
        }

        .filter-section {
          background: #fff;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-form {
          flex: 1;
          min-width: 300px;
        }

        .search-input-group {
          display: flex;
          gap: 1rem;
        }

        .search-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #28a745;
        }

        .search-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #28a745;
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .search-btn:hover {
          background: #218838;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-group label {
          color: #6c757d;
          font-size: 0.875rem;
        }

        .status-select {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.875rem;
          background: #fff;
        }

        .orders-table-container {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .table-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e9ecef;
          background: #f8f9fa;
        }

        .table-info {
          color: #6c757d;
          font-size: 0.875rem;
        }

        .orders-table {
          overflow-x: auto;
        }

        .table-header-row {
          display: grid;
          grid-template-columns: 100px 120px 200px 100px 100px 150px 200px;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #e9ecef;
        }

        .table-row {
          display: grid;
          grid-template-columns: 100px 120px 200px 100px 100px 150px 200px;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f8f9fa;
          align-items: center;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .col-id, .col-user, .col-product, .col-amount, .col-status, .col-date, .col-actions {
          font-size: 0.875rem;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.status-warning {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.status-info {
          background: #d1ecf1;
          color: #0c5460;
        }

        .status-badge.status-success {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.status-danger {
          background: #f8d7da;
          color: #721c24;
        }

        .status-badge.status-secondary {
          background: #e2e3e5;
          color: #383d41;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.75rem;
          margin-right: 0.5rem;
          transition: all 0.2s;
        }

        .action-btn.process {
          background: #17a2b8;
          color: #fff;
        }

        .action-btn.complete {
          background: #28a745;
          color: #fff;
        }

        .action-btn.cancel {
          background: #dc3545;
          color: #fff;
        }

        .action-btn:hover {
          opacity: 0.8;
        }

        .loading-state, .no-data {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: #6c757d;
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid #e9ecef;
          border-top: 2px solid #28a745;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #e9ecef;
        }

        .page-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: #fff;
          color: #2c3e50;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .page-btn:hover:not(:disabled) {
          background: #f8f9fa;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          color: #6c757d;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .filter-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-form {
            min-width: auto;
          }
          
          .table-header-row, .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
