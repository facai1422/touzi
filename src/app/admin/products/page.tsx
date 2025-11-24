'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  title_zh_cn: string;
  title_en: string;
  profit_rate: number;
  duration: number;
  min_invest: number;
  price: number;
  current_progress: number;
  max_progress: number;
  img_zh_cn: string | null;
  status: number;
  sort: number;
  created_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    title_zh_cn: '',
    title_en: '',
    profit_rate: 0,
    duration: 0,
    min_invest: 0,
    price: 0,
    max_progress: 0,
    img_zh_cn: '',
    status: 1,
    sort: 0
  });

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      // 搜索功能
      if (searchTerm) {
        query = query.or(`title_zh_cn.ilike.%${searchTerm}%,title_en.ilike.%${searchTerm}%`);
      }

      // 分页
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query
        .order('sort', { ascending: true })
        .range(from, to);

      if (error) {
        console.error('加载产品数据失败:', error);
        return;
      }

      setProducts(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('加载产品数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProducts();
  };

  const handleAddProduct = () => {
    setFormData({
      title_zh_cn: '',
      title_en: '',
      profit_rate: 0,
      duration: 0,
      min_invest: 0,
      price: 0,
      max_progress: 0,
      img_zh_cn: '',
      status: 1,
      sort: 0
    });
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      title_zh_cn: product.title_zh_cn,
      title_en: product.title_en,
      profit_rate: product.profit_rate,
      duration: product.duration,
      min_invest: product.min_invest,
      price: product.price,
      max_progress: product.max_progress,
      img_zh_cn: product.img_zh_cn || '',
      status: product.status,
      sort: product.sort
    });
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // 更新产品
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id);

        if (error) {
          console.error('更新产品失败:', error);
          return;
        }
      } else {
        // 添加新产品
        const { error } = await supabase
          .from('products')
          .insert([formData]);

        if (error) {
          console.error('添加产品失败:', error);
          return;
        }
      }

      setShowAddModal(false);
      loadProducts();
    } catch (error) {
      console.error('保存产品失败:', error);
    }
  };

  const toggleProductStatus = async (productId: number, currentStatus: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: currentStatus === 1 ? 0 : 1 })
        .eq('id', productId);

      if (error) {
        console.error('更新产品状态失败:', error);
        return;
      }

      loadProducts();
    } catch (error) {
      console.error('更新产品状态失败:', error);
    }
  };

  const deleteProduct = async (productId: number) => {
    if (!confirm('确定要删除这个产品吗？')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('删除产品失败:', error);
        return;
      }

      loadProducts();
    } catch (error) {
      console.error('删除产品失败:', error);
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h2>产品管理</h2>
        <p>管理所有投资产品</p>
      </div>

      {/* 操作栏 */}
      <div className="action-section">
        <div className="search-form">
          <form onSubmit={handleSearch} className="search-form-inline">
            <input
              type="text"
              placeholder="搜索产品名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <i className="material-icons">search</i>
              搜索
            </button>
          </form>
        </div>
        <button className="add-btn" onClick={handleAddProduct}>
          <i className="material-icons">add</i>
          添加产品
        </button>
      </div>

      {/* 产品列表 */}
      <div className="products-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>正在加载产品数据...</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <div className="table-info">
                共 {products.length} 个产品
              </div>
            </div>

            <div className="products-table">
              <div className="table-header-row">
                <div className="col-id">ID</div>
                <div className="col-image">图片</div>
                <div className="col-title">产品名称</div>
                <div className="col-rate">收益率</div>
                <div className="col-duration">期限</div>
                <div className="col-invest">起投金额</div>
                <div className="col-price">项目规模</div>
                <div className="col-progress">进度</div>
                <div className="col-status">状态</div>
                <div className="col-actions">操作</div>
              </div>

              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="table-row">
                    <div className="col-id">{product.id}</div>
                    <div className="col-image">
                      {product.img_zh_cn ? (
                        <img src={product.img_zh_cn} alt={product.title_zh_cn} className="product-image" />
                      ) : (
                        <div className="no-image">无图片</div>
                      )}
                    </div>
                    <div className="col-title">
                      <div className="product-title">{product.title_zh_cn}</div>
                      <div className="product-title-en">{product.title_en}</div>
                    </div>
                    <div className="col-rate">{product.profit_rate.toFixed(2)}%</div>
                    <div className="col-duration">{product.duration}天</div>
                    <div className="col-invest">¥{product.min_invest.toLocaleString()}</div>
                    <div className="col-price">¥{product.price.toLocaleString()}</div>
                    <div className="col-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${(product.current_progress / product.max_progress) * 100}%`}}
                        ></div>
                      </div>
                      <div className="progress-text">
                        {Math.round((product.current_progress / product.max_progress) * 100)}%
                      </div>
                    </div>
                    <div className="col-status">
                      <span className={`status-badge ${product.status ? 'active' : 'inactive'}`}>
                        {product.status ? '上架' : '下架'}
                      </span>
                    </div>
                    <div className="col-actions">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditProduct(product)}
                      >
                        <i className="material-icons">edit</i>
                        编辑
                      </button>
                      <button
                        className="action-btn toggle"
                        onClick={() => toggleProductStatus(product.id, product.status)}
                      >
                        <i className="material-icons">
                          {product.status ? 'visibility_off' : 'visibility'}
                        </i>
                        {product.status ? '下架' : '上架'}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <i className="material-icons">delete</i>
                        删除
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <i className="material-icons">inventory</i>
                  <p>暂无产品数据</p>
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

      {/* 添加/编辑产品模态框 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? '编辑产品' : '添加产品'}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <i className="material-icons">close</i>
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>产品名称（中文）</label>
                <input
                  type="text"
                  value={formData.title_zh_cn}
                  onChange={(e) => setFormData({...formData, title_zh_cn: e.target.value})}
                  required
                  aria-label="产品名称（中文）"
                />
                </div>
                <div className="form-group">
                  <label>产品名称（英文）</label>
                  <input
                    type="text"
                    value={formData.title_en}
                    onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                    required
                    aria-label="产品名称（英文）"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>日化利率（%）</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.profit_rate}
                    onChange={(e) => setFormData({...formData, profit_rate: Number(e.target.value)})}
                    required
                    aria-label="日化利率"
                  />
                </div>
                <div className="form-group">
                  <label>投资期限（天）</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                    required
                    aria-label="投资期限"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>起投金额（元）</label>
                  <input
                    type="number"
                    value={formData.min_invest}
                    onChange={(e) => setFormData({...formData, min_invest: Number(e.target.value)})}
                    required
                    aria-label="起投金额"
                  />
                </div>
                <div className="form-group">
                  <label>项目规模（元）</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    required
                    aria-label="项目规模"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>最大进度</label>
                  <input
                    type="number"
                    value={formData.max_progress}
                    onChange={(e) => setFormData({...formData, max_progress: Number(e.target.value)})}
                    required
                    aria-label="最大进度"
                  />
                </div>
                <div className="form-group">
                  <label>排序</label>
                  <input
                    type="number"
                    value={formData.sort}
                    onChange={(e) => setFormData({...formData, sort: Number(e.target.value)})}
                    aria-label="排序"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>产品图片URL</label>
                <input
                  type="url"
                  value={formData.img_zh_cn}
                  onChange={(e) => setFormData({...formData, img_zh_cn: e.target.value})}
                  aria-label="产品图片URL"
                />
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.status === 1}
                    onChange={(e) => setFormData({...formData, status: e.target.checked ? 1 : 0})}
                  />
                  上架状态
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  取消
                </button>
                <button type="submit" className="btn-save">
                  {editingProduct ? '更新' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .products-page {
          max-width: 1400px;
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

        .action-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .search-form-inline {
          display: flex;
          gap: 1rem;
        }

        .search-input {
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.875rem;
          min-width: 300px;
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

        .add-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #007bff;
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .products-table-container {
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

        .products-table {
          overflow-x: auto;
        }

        .table-header-row {
          display: grid;
          grid-template-columns: 60px 80px 200px 80px 80px 100px 100px 120px 80px 200px;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 1px solid #e9ecef;
        }

        .table-row {
          display: grid;
          grid-template-columns: 60px 80px 200px 80px 80px 100px 100px 120px 80px 200px;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f8f9fa;
          align-items: center;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .product-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
        }

        .no-image {
          width: 50px;
          height: 50px;
          background: #f8f9fa;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: #6c757d;
        }

        .product-title {
          font-weight: 500;
          color: #2c3e50;
        }

        .product-title-en {
          font-size: 0.75rem;
          color: #6c757d;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #28a745;
          transition: width 0.3s;
        }

        .progress-text {
          font-size: 0.75rem;
          color: #6c757d;
          margin-top: 0.25rem;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
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

        .action-btn.edit {
          background: #ffc107;
          color: #212529;
        }

        .action-btn.toggle {
          background: #17a2b8;
          color: #fff;
        }

        .action-btn.delete {
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

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #fff;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #2c3e50;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #6c757d;
        }

        .modal-form {
          padding: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #2c3e50;
        }

        .form-group input {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #28a745;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
        }

        .btn-cancel {
          padding: 0.75rem 1.5rem;
          border: 1px solid #ddd;
          background: #fff;
          color: #6c757d;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-save {
          padding: 0.75rem 1.5rem;
          border: none;
          background: #28a745;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .action-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .form-row {
            grid-template-columns: 1fr;
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
