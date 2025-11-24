export default function AdminTestPage() {
  return (
    <div style={{ padding: '2rem', background: '#f8f9fa', minHeight: '100vh' }}>
      <h1>管理后台测试页面</h1>
      <p>如果您能看到这个页面，说明管理后台路由正常工作。</p>
      <div style={{ marginTop: '2rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
        <h2>测试信息</h2>
        <ul>
          <li>页面加载时间: {new Date().toLocaleString()}</li>
          <li>路由状态: 正常</li>
          <li>样式加载: 正常</li>
        </ul>
      </div>
    </div>
  );
}
