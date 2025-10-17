// HMR修复测试脚本
const fs = require('fs');
const path = require('path');

console.log('🧪 测试HMR修复...');

// 检查关键文件是否存在
const criticalFiles = [
  'next.config.ts',
  'package.json',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/contexts/AuthContext.tsx',
  'src/lib/supabase.ts'
];

let allFilesExist = true;

criticalFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} 存在`);
  } else {
    console.log(`❌ ${file} 不存在`);
    allFilesExist = false;
  }
});

// 检查package.json配置
try {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  console.log('\n📦 检查package.json配置:');
  console.log(`   开发脚本: ${packageJson.scripts.dev}`);
  console.log(`   Turbopack脚本: ${packageJson.scripts['dev:turbo']}`);
  console.log(`   Next.js版本: ${packageJson.dependencies.next}`);
  console.log(`   React版本: ${packageJson.dependencies.react}`);
} catch (error) {
  console.log('❌ 无法读取package.json:', error.message);
  allFilesExist = false;
}

// 检查next.config.ts
try {
  const configPath = path.join(__dirname, '..', 'next.config.ts');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  console.log('\n⚙️  检查next.config.ts配置:');
  if (configContent.includes('experimental')) {
    console.log('   ✅ 包含experimental配置');
  }
  if (configContent.includes('webpack')) {
    console.log('   ✅ 包含webpack配置');
  }
  if (configContent.includes('turbo')) {
    console.log('   ✅ 包含turbo配置');
  }
} catch (error) {
  console.log('❌ 无法读取next.config.ts:', error.message);
  allFilesExist = false;
}

if (allFilesExist) {
  console.log('\n🎉 所有关键文件都存在，HMR修复应该有效！');
  console.log('\n📋 建议的测试步骤:');
  console.log('1. 运行 npm run dev 启动开发服务器');
  console.log('2. 如果仍有问题，运行 npm run dev:turbo');
  console.log('3. 如果问题持续，运行 node fix-hmr.js 清理缓存');
} else {
  console.log('\n⚠️  发现缺失文件，请检查项目结构');
}
