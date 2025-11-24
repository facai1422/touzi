# Netlify 部署指南

## 项目部署到 Netlify 的完整步骤

### 1. 准备工作

#### 确保项目可以正常构建
```bash
cd touzices-nextjs
npm install
npm run build
```

#### 检查构建输出
- 确保 `.next` 目录生成
- 检查是否有构建错误
- 验证所有页面路由正常

### 2. 部署方式

#### 方式一：通过 Netlify 网站部署（推荐）

1. **访问 Netlify**
   - 打开 [https://netlify.com](https://netlify.com)
   - 点击 "Sign up" 注册账户（或登录）

2. **连接 Git 仓库**
   - 点击 "New site from Git"
   - 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
   - 选择 `touzices-nextjs` 仓库

3. **配置构建设置**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **环境变量设置**
   - 在 Site settings > Environment variables 中添加：
   ```
   NODE_VERSION=18
   NPM_VERSION=9
   NODE_ENV=production
   ```

5. **部署**
   - 点击 "Deploy site"
   - 等待构建完成

#### 方式二：通过 Netlify CLI 部署

1. **安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登录 Netlify**
   ```bash
   netlify login
   ```

3. **初始化项目**
   ```bash
   cd touzices-nextjs
   netlify init
   ```

4. **构建并部署**
   ```bash
   npm run build
   netlify deploy --prod --dir=.next
   ```

#### 方式三：拖拽部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **压缩 .next 目录**
   - 将 `.next` 目录压缩为 zip 文件

3. **拖拽到 Netlify**
   - 访问 [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - 拖拽 zip 文件到页面

### 3. 配置文件说明

#### netlify.toml
```toml
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### _redirects
```
/*    /index.html   200
```

### 4. 部署后配置

#### 自定义域名
1. 在 Netlify 控制台选择你的站点
2. 进入 "Domain settings"
3. 添加自定义域名
4. 配置 DNS 记录

#### 环境变量
在 Netlify 控制台设置环境变量：
- `NODE_ENV=production`
- `NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥`

#### 重定向规则
项目已配置 SPA 重定向规则，确保所有路由正常工作。

### 5. 常见问题解决

#### 构建失败
```bash
# 清理缓存
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### 路由问题
- 确保 `_redirects` 文件在根目录
- 检查 `netlify.toml` 中的重定向配置

#### 环境变量问题
- 在 Netlify 控制台正确设置环境变量
- 确保变量名以 `NEXT_PUBLIC_` 开头（客户端变量）

### 6. 性能优化

#### 启用 Netlify 功能
- **Netlify Functions**: 用于 API 路由
- **Netlify Edge Functions**: 边缘计算
- **Netlify Forms**: 表单处理
- **Netlify Identity**: 用户认证

#### 缓存策略
```toml
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 7. 监控和维护

#### 部署状态
- 在 Netlify 控制台查看部署历史
- 设置部署通知（邮件/Slack）

#### 性能监控
- 使用 Netlify Analytics
- 配置 Web Vitals 监控

### 8. 部署检查清单

- [ ] 项目可以本地构建成功
- [ ] 所有环境变量已配置
- [ ] 自定义域名已设置（如需要）
- [ ] SSL 证书已启用
- [ ] 重定向规则已配置
- [ ] 缓存策略已优化
- [ ] 监控已设置

### 9. 部署后测试

#### 功能测试
1. 访问所有页面路由
2. 测试用户注册/登录
3. 测试充值按钮功能
4. 测试发现页面内嵌网站
5. 测试响应式设计

#### 性能测试
1. 使用 Google PageSpeed Insights
2. 测试移动端性能
3. 检查 Core Web Vitals

### 10. 持续部署

#### 自动部署
- 连接 Git 仓库后，每次推送都会自动部署
- 可以设置分支部署策略
- 支持预览部署（Pull Request）

#### 回滚
- 在 Netlify 控制台可以快速回滚到之前的版本
- 支持一键回滚功能

## 部署时间
2025年1月17日

## 部署人员
AI助手
