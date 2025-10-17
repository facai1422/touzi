#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 修复Next.js HMR问题...');

// 清理缓存目录
const cacheDirs = [
  '.next',
  'node_modules/.cache',
  '.turbo'
];

cacheDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`🗑️  清理目录: ${dir}`);
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } catch (error) {
      console.warn(`⚠️  无法清理 ${dir}:`, error.message);
    }
  }
});

// 清理npm缓存
console.log('🧹 清理npm缓存...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
} catch (error) {
  console.warn('⚠️  清理npm缓存失败:', error.message);
}

console.log('✅ 缓存清理完成！');
console.log('💡 请运行以下命令重新启动开发服务器:');
console.log('   npm run dev');
console.log('');
console.log('如果问题仍然存在，请尝试:');
console.log('   npm run dev:turbo  (使用Turbopack)');
console.log('   或');
console.log('   npm run dev        (使用标准webpack)');
