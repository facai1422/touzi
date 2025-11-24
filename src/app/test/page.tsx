import Link from 'next/link';

export default function TestPage() {
  return (
    <div style={{ 
      padding: '2rem', 
      background: '#f8f9fa', 
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '1rem' }}>测试页面</h1>
      <p style={{ color: '#6c757d', marginBottom: '2rem' }}>如果您能看到这个页面，说明Next.js应用正常工作。</p>
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#495057', marginBottom: '1rem' }}>系统信息</h2>
        <ul style={{ color: '#6c757d', lineHeight: '1.6' }}>
          <li>页面加载时间: {new Date().toLocaleString()}</li>
          <li>Next.js版本: 15.5.5</li>
          <li>路由状态: 正常</li>
          <li>样式加载: 正常</li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#e3f2fd', 
        borderRadius: '8px',
        border: '1px solid #bbdefb'
      }}>
        <h3 style={{ color: '#1976d2', marginBottom: '0.5rem' }}>访问其他页面</h3>
        <p style={{ color: '#424242', margin: '0 0 1rem 0' }}>
          请尝试访问以下页面：
        </p>
        <ul style={{ color: '#424242', margin: '0' }}>
          <li><Link href="/" style={{ color: '#1976d2' }}>首页</Link></li>
          <li><Link href="/login" style={{ color: '#1976d2' }}>登录页面</Link></li>
          <li><Link href="/admin/login" style={{ color: '#1976d2' }}>管理后台登录</Link></li>
          <li><Link href="/admin/simple" style={{ color: '#1976d2' }}>管理后台测试</Link></li>
        </ul>
      </div>
    </div>
  );
}
