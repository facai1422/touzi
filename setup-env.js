#!/usr/bin/env node

/**
 * 环境变量配置脚本
 * 用于快速设置项目所需的环境变量
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 开始配置环境变量...\n');

// 环境变量配置
const envConfig = {
  // Supabase 配置
  'NEXT_PUBLIC_SUPABASE_URL': 'https://xfcbxphhesbhazmjaztj.supabase.co',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmY2J4cGhoZXNiaGF6bWphenRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzA2MDQsImV4cCI6MjA3NjIwNjYwNH0.Fe3NMFJn8_rQDRbIKEc-SwLTC2Zj9AyVLtwJZF4IlVY',
  
  // 应用配置
  'NODE_ENV': 'production',
  'NEXT_PUBLIC_APP_NAME': '北京世桥生物制药投资系统',
  'NEXT_PUBLIC_APP_URL': 'https://your-domain.com',
  
  // 客服系统配置
  'NEXT_PUBLIC_CUSTOMER_SERVICE_URL': 'https://chat2.boltcode.vip',
  'NEXT_PUBLIC_BUSINESS_ID': '1',
  'NEXT_PUBLIC_GROUP_ID': '0',
  'NEXT_PUBLIC_SPECIAL': '1',
  
  // 开发配置
  'NEXT_PUBLIC_DEV_MODE': 'false',
  'NEXT_PUBLIC_DEBUG': 'false'
};

// 生成 .env.local 文件
function createEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  let envContent = '# 环境变量配置文件\n';
  envContent += '# 由 setup-env.js 自动生成\n\n';
  
  Object.entries(envConfig).forEach(([key, value]) => {
    envContent += `${key}=${value}\n`;
  });
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ 已创建 .env.local 文件');
}

// 生成 .env.production 文件
function createProductionEnvFile() {
  const envPath = path.join(__dirname, '.env.production');
  let envContent = '# 生产环境变量配置\n';
  envContent += '# 用于生产环境部署\n\n';
  
  Object.entries(envConfig).forEach(([key, value]) => {
    envContent += `${key}=${value}\n`;
  });
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ 已创建 .env.production 文件');
}

// 生成 Netlify 环境变量配置
function createNetlifyConfig() {
  const netlifyPath = path.join(__dirname, 'netlify.toml');
  
  let netlifyContent = `[build]
  publish = "out"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"
`;

  // 添加环境变量到 netlify.toml
  Object.entries(envConfig).forEach(([key, value]) => {
    netlifyContent += `  ${key} = "${value}"\n`;
  });

  netlifyContent += `
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 3000
  publish = ".next"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
`;

  fs.writeFileSync(netlifyPath, netlifyContent);
  console.log('✅ 已更新 netlify.toml 文件');
}

// 生成 Vercel 环境变量配置
function createVercelConfig() {
  const vercelPath = path.join(__dirname, 'vercel.json');
  
  const vercelConfig = {
    "version": 2,
    "builds": [
      {
        "src": "package.json",
        "use": "@vercel/next"
      }
    ],
    "routes": [
      {
        "src": "/(.*)",
        "dest": "/$1"
      }
    ],
    "env": envConfig,
    "functions": {
      "src/app/**/*.tsx": {
        "runtime": "nodejs18.x"
      }
    }
  };

  fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2));
  console.log('✅ 已更新 vercel.json 文件');
}

// 显示配置信息
function showConfigInfo() {
  console.log('\n📋 环境变量配置完成！\n');
  console.log('🔧 已配置的变量：');
  Object.entries(envConfig).forEach(([key, value]) => {
    console.log(`   ${key}=${value}`);
  });
  
  console.log('\n📁 生成的文件：');
  console.log('   .env.local - 本地开发环境变量');
  console.log('   .env.production - 生产环境变量');
  console.log('   netlify.toml - Netlify 部署配置');
  console.log('   vercel.json - Vercel 部署配置');
  
  console.log('\n🚀 下一步：');
  console.log('   1. 检查并修改 .env.local 中的配置');
  console.log('   2. 运行 npm run dev 启动开发服务器');
  console.log('   3. 部署到 Netlify 或 Vercel');
  
  console.log('\n⚠️  注意事项：');
  console.log('   - 请勿将 .env.local 文件提交到 Git');
  console.log('   - 生产环境请使用部署平台的环境变量设置');
  console.log('   - 定期更新密钥以确保安全');
}

// 主函数
function main() {
  try {
    createEnvFile();
    createProductionEnvFile();
    createNetlifyConfig();
    createVercelConfig();
    showConfigInfo();
  } catch (error) {
    console.error('❌ 配置失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { envConfig, createEnvFile, createProductionEnvFile };
