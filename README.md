# 投资系统 Next.js 前端

这是一个基于 Next.js 15.5.5 构建的投资系统前端应用，完全复制了原有 Vue.js 项目的功能和界面。

## 项目特性

- ✅ 响应式设计，支持移动端和桌面端
- ✅ 现代化 UI 设计，使用 Tailwind CSS
- ✅ TypeScript 支持，类型安全
- ✅ 组件化架构，易于维护
- ✅ 路由导航，单页应用体验
- ✅ 动画效果，流畅的用户体验

## 页面结构

### 主要页面
- **首页** (`/`) - 产品展示、快捷操作、通知栏
- **研发产品** (`/products`) - 产品列表、分类筛选
- **我的项目** (`/orders`) - 投资记录管理
- **发现** (`/discover`) - 内容发现页面
- **账户** (`/profile`) - 个人中心、资产管理

### 功能特性
- 产品展示和筛选
- 用户信息管理
- 投资记录查看
- 响应式底部导航
- 现代化 UI 组件

## 技术栈

- **框架**: Next.js 15.5.5
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **构建工具**: Turbopack
- **包管理**: npm

## 开发环境

### 环境要求
- Node.js 18.0 或更高版本
- npm 9.0 或更高版本

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

## 项目结构

```
touzices-nextjs/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首页
│   │   ├── products/
│   │   │   └── page.tsx          # 研发产品页面
│   │   ├── orders/
│   │   │   └── page.tsx          # 我的项目页面
│   │   ├── discover/
│   │   │   └── page.tsx          # 发现页面
│   │   ├── profile/
│   │   │   └── page.tsx          # 账户页面
│   │   ├── globals.css           # 全局样式
│   │   └── layout.tsx            # 根布局
│   └── components/               # 组件目录
├── public/                        # 静态资源
├── package.json                  # 项目配置
├── tailwind.config.js           # Tailwind 配置
├── next.config.js               # Next.js 配置
└── README.md                    # 项目说明
```

## 部署说明

### 本地部署
1. 克隆项目到本地
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 访问 http://localhost:3000

### 生产部署
1. 构建项目：`npm run build`
2. 启动生产服务器：`npm start`
3. 或使用 PM2 等进程管理器

### 静态部署
1. 构建项目：`npm run build`
2. 导出静态文件：`npm run export`
3. 部署到 CDN 或静态托管服务

## 功能对比

| 功能 | Vue.js 原版 | Next.js 新版 | 状态 |
|------|-------------|--------------|------|
| 首页展示 | ✅ | ✅ | 完成 |
| 产品列表 | ✅ | ✅ | 完成 |
| 分类筛选 | ✅ | ✅ | 完成 |
| 用户中心 | ✅ | ✅ | 完成 |
| 底部导航 | ✅ | ✅ | 完成 |
| 响应式设计 | ✅ | ✅ | 完成 |
| 动画效果 | ✅ | ✅ | 完成 |

## 开发说明

### 添加新页面
1. 在 `src/app/` 目录下创建新的页面目录
2. 创建 `page.tsx` 文件
3. 实现页面组件
4. 更新底部导航（如需要）

### 修改样式
1. 使用 Tailwind CSS 类名
2. 在 `globals.css` 中添加自定义样式
3. 使用 CSS 变量和主题配置

### 添加功能
1. 在页面组件中实现功能逻辑
2. 使用 React Hooks 管理状态
3. 添加 TypeScript 类型定义

## 注意事项

1. 确保 Node.js 版本兼容性
2. 使用 TypeScript 进行类型检查
3. 遵循 Next.js 最佳实践
4. 保持代码风格一致性
5. 定期更新依赖包

## 联系方式

如有问题或建议，请联系开发团队。

---

**版本**: 1.0.0  
**更新时间**: 2025-01-15  
**维护者**: 开发团队