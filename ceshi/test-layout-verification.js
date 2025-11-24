// 验证横向菜单布局的CSS属性
const fs = require('fs');
const path = require('path');

console.log('🔍 验证横向菜单布局...');

try {
  const profilePath = path.join(__dirname, '..', 'src/app/profile/page.tsx');
  const profileContent = fs.readFileSync(profilePath, 'utf8');
  
  console.log('\n📋 检查CSS布局属性:');
  
  // 检查关键CSS属性
  const layoutChecks = [
    {
      name: 'Flexbox布局',
      pattern: /display:\s*flex/,
      description: '使用flexbox实现横向布局'
    },
    {
      name: '图标固定宽度',
      pattern: /flex-shrink:\s*0/,
      description: '图标不收缩，保持固定宽度'
    },
    {
      name: '图标右边距',
      pattern: /margin-right:\s*0\.75rem/,
      description: '图标与文字之间的间距'
    },
    {
      name: '文字自动填充',
      pattern: /flex:\s*1/,
      description: '文字区域自动填充剩余空间'
    },
    {
      name: '箭头右对齐',
      pattern: /margin-left:\s*auto/,
      description: '箭头自动对齐到右侧'
    },
    {
      name: '垂直居中对齐',
      pattern: /align-items:\s*center/,
      description: '所有元素垂直居中对齐'
    }
  ];
  
  let passedChecks = 0;
  
  layoutChecks.forEach(check => {
    if (check.pattern.test(profileContent)) {
      console.log(`   ✅ ${check.name}: ${check.description}`);
      passedChecks++;
    } else {
      console.log(`   ❌ ${check.name}: ${check.description}`);
    }
  });
  
  console.log(`\n📊 布局检查结果: ${passedChecks}/${layoutChecks.length} 通过`);
  
  if (passedChecks === layoutChecks.length) {
    console.log('🎉 所有布局属性都正确配置！');
  } else {
    console.log('⚠️  部分布局属性需要调整');
  }
  
  // 检查菜单项结构
  console.log('\n🔍 检查菜单项结构:');
  
  const structureChecks = [
    {
      name: '菜单项容器',
      pattern: /\.menu-item\s*{/,
      description: '菜单项容器样式'
    },
    {
      name: '图标容器',
      pattern: /\.menu-icon\s*{/,
      description: '图标容器样式'
    },
    {
      name: '文字容器',
      pattern: /\.menu-text\s*{/,
      description: '文字容器样式'
    },
    {
      name: '箭头容器',
      pattern: /\.menu-arrow\s*{/,
      description: '箭头容器样式'
    }
  ];
  
  structureChecks.forEach(check => {
    if (check.pattern.test(profileContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });
  
  console.log('\n📝 布局说明:');
  console.log('1. 图标在左侧，固定宽度不收缩');
  console.log('2. 菜单名字在图标右侧，自动填充剩余空间');
  console.log('3. 箭头在右侧，自动对齐');
  console.log('4. 所有元素垂直居中对齐');
  console.log('5. 横向布局，垂直排列多个菜单项');
  
} catch (error) {
  console.log('❌ 无法读取profile页面:', error.message);
}

console.log('\n🎯 横向布局特点:');
console.log('- 图标 → 菜单名字 → 箭头');
console.log('- 从左到右的横向排列');
console.log('- 每个菜单项占一行');
console.log('- 响应式设计，适配不同屏幕');
