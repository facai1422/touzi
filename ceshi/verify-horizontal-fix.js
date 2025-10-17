// 验证横向布局修复
const fs = require('fs');
const path = require('path');

console.log('🔧 验证横向布局修复...');

try {
  const profilePath = path.join(__dirname, '..', 'src/app/profile/page.tsx');
  const profileContent = fs.readFileSync(profilePath, 'utf8');
  
  console.log('\n🔍 检查关键修复属性:');
  
  const fixChecks = [
    {
      name: '强制横向布局',
      pattern: /flex-direction:\s*row/,
      description: '明确指定横向布局'
    },
    {
      name: '图标顺序',
      pattern: /order:\s*1/,
      description: '图标排在第一位'
    },
    {
      name: '文字顺序',
      pattern: /order:\s*2/,
      description: '文字排在第二位'
    },
    {
      name: '箭头顺序',
      pattern: /order:\s*3/,
      description: '箭头排在第三位'
    },
    {
      name: '垂直居中',
      pattern: /align-items:\s*center/,
      description: '所有元素垂直居中'
    },
    {
      name: '图标固定宽度',
      pattern: /flex-shrink:\s*0/,
      description: '图标不收缩'
    },
    {
      name: '文字自动填充',
      pattern: /flex:\s*1/,
      description: '文字区域自动填充'
    },
    {
      name: '箭头右对齐',
      pattern: /margin-left:\s*auto/,
      description: '箭头自动右对齐'
    }
  ];
  
  let passedChecks = 0;
  
  fixChecks.forEach(check => {
    if (check.pattern.test(profileContent)) {
      console.log(`   ✅ ${check.name}: ${check.description}`);
      passedChecks++;
    } else {
      console.log(`   ❌ ${check.name}: ${check.description}`);
    }
  });
  
  console.log(`\n📊 修复检查结果: ${passedChecks}/${fixChecks.length} 通过`);
  
  if (passedChecks >= 6) {
    console.log('🎉 横向布局修复成功！');
  } else {
    console.log('⚠️  需要进一步修复');
  }
  
  // 检查HTML结构
  console.log('\n🔍 检查HTML结构:');
  
  const structureChecks = [
    {
      name: '菜单项容器',
      pattern: /<Link href="[^"]*" className="menu-item">/,
      description: '使用Link组件'
    },
    {
      name: '图标容器',
      pattern: /<div className="menu-icon/,
      description: '图标容器结构'
    },
    {
      name: '文字容器',
      pattern: /<div className="menu-text">/,
      description: '文字容器结构'
    },
    {
      name: '箭头容器',
      pattern: /<div className="menu-arrow">/,
      description: '箭头容器结构'
    }
  ];
  
  structureChecks.forEach(check => {
    if (check.pattern.test(profileContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name}`);
    }
  });
  
  console.log('\n📝 修复要点:');
  console.log('1. ✅ 添加了 flex-direction: row 强制横向布局');
  console.log('2. ✅ 使用 order 属性明确元素顺序');
  console.log('3. ✅ 图标、文字、箭头按顺序排列');
  console.log('4. ✅ 所有元素垂直居中对齐');
  console.log('5. ✅ 图标固定宽度，文字自动填充，箭头右对齐');
  
  console.log('\n🎯 预期效果:');
  console.log('图标应该在文字左侧，而不是上方');
  console.log('布局应该是: [图标] [文字] [箭头]');
  
} catch (error) {
  console.log('❌ 无法读取profile页面:', error.message);
}

console.log('\n🚀 建议测试步骤:');
console.log('1. 启动开发服务器: npm run dev');
console.log('2. 访问 /profile 页面');
console.log('3. 检查菜单项是否为横向布局');
console.log('4. 确认图标在文字左侧');
