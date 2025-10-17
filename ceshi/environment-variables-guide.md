# 环境变量配置指南

## 概述
本文档详细说明了项目部署时需要配置的所有环境变量，包括开发环境、生产环境和不同部署平台的具体配置。

## 🔧 必需的环境变量

### 1. Supabase 数据库配置
```bash
# Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_URL=https://xfcbxphhesbhazmjaztj.supabase.co

# Supabase 匿名密钥 (客户端使用)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmY2J4cGhoZXNiaGF6bWphenRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzA2MDQsImV4cCI6MjA3NjIwNjYwNH0.Fe3NMFJn8_rQDRbIKEc-SwLTC2Zj9AyVLtwJZF4IlVY
```

### 2. 应用基础配置
```bash
# 应用环境
NODE_ENV=production

# 应用基础URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# 应用名称
NEXT_PUBLIC_APP_NAME=北京世桥生物制药投资系统
```

### 3. 客服系统配置
```bash
# 客服聊天链接
NEXT_PUBLIC_CUSTOMER_SERVICE_URL=https://chat2.boltcode.vip

# 客服参数
NEXT_PUBLIC_BUSINESS_ID=1
NEXT_PUBLIC_GROUP_ID=0
NEXT_PUBLIC_SPECIAL=1
```

## 🚀 部署平台配置

### Netlify 部署配置

#### 1. 通过 Netlify 控制台设置
1. 登录 [Netlify](https://app.netlify.com)
2. 选择你的站点
3. 进入 "Site settings" > "Environment variables"
4. 添加以下变量：

```bash
# 必需变量
NEXT_PUBLIC_SUPABASE_URL=https://xfcbxphhesbhazmjaztj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmY2J4cGhoZXNiaGF6bWphenRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzA2MDQsImV4cCI6MjA3NjIwNjYwNH0.Fe3NMFJn8_rQDRbIKEc-SwLTC2Zj9AyVLtwJZF4IlVY
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-netlify-domain.netlify.app
NEXT_PUBLIC_APP_NAME=北京世桥生物制药投资系统
NEXT_PUBLIC_CUSTOMER_SERVICE_URL=https://chat2.boltcode.vip
NEXT_PUBLIC_BUSINESS_ID=1
NEXT_PUBLIC_GROUP_ID=0
NEXT_PUBLIC_SPECIAL=1
```

#### 2. 通过 netlify.toml 配置
```toml
[build.environment]
  NEXT_PUBLIC_SUPABASE_URL = "https://xfcbxphhesbhazmjaztj.supabase.co"
  NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmY2J4cGhoZXNiaGF6bWphenRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzA2MDQsImV4cCI6MjA3NjIwNjYwNH0.Fe3NMFJn8_rQDRbIKEc-SwLTC2Zj9AyVLtwJZF4IlVY"
  NODE_ENV = "production"
  NEXT_PUBLIC_APP_NAME = "北京世桥生物制药投资系统"
  NEXT_PUBLIC_CUSTOMER_SERVICE_URL = "https://chat2.boltcode.vip"
  NEXT_PUBLIC_BUSINESS_ID = "1"
  NEXT_PUBLIC_GROUP_ID = "0"
  NEXT_PUBLIC_SPECIAL = "1"
```

### Vercel 部署配置

#### 1. 通过 Vercel 控制台设置
1. 登录 [Vercel](https://vercel.com)
2. 选择你的项目
3. 进入 "Settings" > "Environment Variables"
4. 添加环境变量

#### 2. 通过 vercel.json 配置
```json
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://xfcbxphhesbhazmjaztj.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmY2J4cGhoZXNiaGF6bWphenRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzA2MDQsImV4cCI6MjA3NjIwNjYwNH0.Fe3NMFJn8_rQDRbIKEc-SwLTC2Zj9AyVLtwJZF4IlVY",
    "NODE_ENV": "production",
    "NEXT_PUBLIC_APP_NAME": "北京世桥生物制药投资系统",
    "NEXT_PUBLIC_CUSTOMER_SERVICE_URL": "https://chat2.boltcode.vip",
    "NEXT_PUBLIC_BUSINESS_ID": "1",
    "NEXT_PUBLIC_GROUP_ID": "0",
    "NEXT_PUBLIC_SPECIAL": "1"
  }
}
```

## 🔒 安全配置

### 生产环境安全变量
```bash
# JWT 密钥 (用于用户认证)
JWT_SECRET=your_strong_jwt_secret_here

# 加密密钥 (用于敏感数据加密)
ENCRYPTION_KEY=your_strong_encryption_key_here

# Supabase 服务角色密钥 (仅服务端使用)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 开发环境配置
```bash
# 开发模式
NEXT_PUBLIC_DEV_MODE=true

# 调试模式
NEXT_PUBLIC_DEBUG=true

# 本地开发URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 移动端配置

### PWA 配置
```bash
# PWA 应用名称
NEXT_PUBLIC_PWA_NAME=世桥生物投资

# PWA 短名称
NEXT_PUBLIC_PWA_SHORT_NAME=世桥投资

# PWA 主题色
NEXT_PUBLIC_PWA_THEME_COLOR=#ef4444

# PWA 背景色
NEXT_PUBLIC_PWA_BACKGROUND_COLOR=#ffffff
```

## 🌐 多语言配置

### 国际化配置
```bash
# 默认语言
NEXT_PUBLIC_DEFAULT_LOCALE=zh-CN

# 支持的语言
NEXT_PUBLIC_SUPPORTED_LOCALES=zh-CN,en-US

# 时区配置
NEXT_PUBLIC_TIMEZONE=Asia/Shanghai
```

## 📊 分析配置

### 网站分析
```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 百度统计
NEXT_PUBLIC_BAIDU_ANALYTICS=your_baidu_analytics_id

# 友盟统计
NEXT_PUBLIC_UMENG_ID=your_umeng_id
```

## 🔧 开发工具配置

### 调试工具
```bash
# 启用 React DevTools
NEXT_PUBLIC_REACT_DEVTOOLS=true

# 启用 Redux DevTools
NEXT_PUBLIC_REDUX_DEVTOOLS=true

# 日志级别
NEXT_PUBLIC_LOG_LEVEL=info
```

## 📋 环境变量检查清单

### 部署前检查
- [ ] Supabase URL 和密钥已配置
- [ ] 应用基础URL已设置
- [ ] 客服系统链接已配置
- [ ] 生产环境变量已设置
- [ ] 安全密钥已生成
- [ ] 第三方服务配置已完成

### 测试检查
- [ ] 数据库连接正常
- [ ] 用户认证功能正常
- [ ] 客服聊天功能正常
- [ ] 页面路由正常
- [ ] 静态资源加载正常

## 🚨 安全注意事项

### 1. 密钥管理
- 不要在代码中硬编码敏感信息
- 使用环境变量存储所有密钥
- 定期轮换密钥
- 不要在客户端暴露服务端密钥

### 2. 权限控制
- 使用 Supabase RLS (Row Level Security)
- 限制数据库访问权限
- 验证用户输入
- 实施适当的错误处理

### 3. 数据保护
- 加密敏感数据
- 使用 HTTPS
- 实施 CSP (Content Security Policy)
- 定期安全审计

## 📞 技术支持

如果在配置环境变量时遇到问题，请检查：

1. **变量名称** - 确保变量名正确
2. **变量值** - 确保值格式正确
3. **作用域** - 确保变量在正确的作用域中
4. **重启服务** - 修改环境变量后重启服务

## 🔗 相关链接

- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase 环境变量配置](https://supabase.com/docs/guides/getting-started#environment-variables)
- [Netlify 环境变量配置](https://docs.netlify.com/environment-variables/overview/)
- [Vercel 环境变量配置](https://vercel.com/docs/concepts/projects/environment-variables)

---

**更新时间**: 2025年1月17日  
**维护者**: AI助手
