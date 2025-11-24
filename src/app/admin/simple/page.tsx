export default function AdminSimplePage() {
  return (
    <div style={{ 
      padding: '2rem', 
      background: '#f8f9fa', 
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '1rem' }}>管理后台简单测试页面</h1>
      <p style={{ color: '#6c757d', marginBottom: '2rem' }}>如果您能看到这个页面，说明管理后台路由正常工作。</p>
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#495057', marginBottom: '1rem' }}>测试信息</h2>
        <ul style={{ color: '#6c757d', lineHeight: '1.6' }}>
          <li>页面加载时间: {new Date().toLocaleString()}</li>
          <li>路由状态: 正常</li>
          <li>样式加载: 正常</li>
          <li>Next.js版本: 15.5.5</li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#e3f2fd', 
        borderRadius: '8px',
        border: '1px solid #bbdefb'
      }}>
        <h3 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>下一步测试</h3>
        <p style={{ color: '#424242', margin: '0' }}>
          请访问 <a href="/admin/login" style={{ color: '#1976d2' }}>/admin/login</a> 测试登录页面
        </p>
      </div>
    </div>
  );
}
