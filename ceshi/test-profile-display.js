// 测试我的页面显示逻辑
console.log('🧪 测试我的页面显示逻辑...');

// 模拟用户数据
const testUsers = [
  {
    id: 1,
    phone: '13800138000',
    name: 'test',
    money: 197911.14,
    member_level: 1,
    auth: 0, // 未实名
    created_at: '2024-01-01T00:00:00Z',
    real_name: null
  },
  {
    id: 2,
    phone: '13800138001',
    name: 'test2',
    money: 50000.00,
    member_level: 2,
    auth: 1, // 已实名
    created_at: '2024-01-01T00:00:00Z',
    real_name: '李振华'
  }
];

// 测试显示名称逻辑
function getDisplayName(user) {
  if (user?.auth && user?.real_name) {
    return user.real_name;
  }
  return user?.phone || '用户';
}

// 测试头像显示文字逻辑
function getAvatarText(user) {
  if (user?.auth && user?.real_name) {
    return user.real_name.charAt(0);
  }
  return user?.phone?.charAt(0) || '用';
}

console.log('\n📋 测试结果:');
console.log('='.repeat(50));

testUsers.forEach((user, index) => {
  console.log(`\n用户 ${index + 1}:`);
  console.log(`  手机号: ${user.phone}`);
  console.log(`  实名状态: ${user.auth ? '已实名' : '未实名'}`);
  console.log(`  真实姓名: ${user.real_name || '无'}`);
  console.log(`  显示名称: ${getDisplayName(user)}`);
  console.log(`  头像文字: ${getAvatarText(user)}`);
  console.log(`  余额: ¥${user.money.toFixed(2)}`);
});

console.log('\n✅ 测试完成！');
console.log('\n📝 预期结果:');
console.log('1. 未实名用户应显示手机号作为名称');
console.log('2. 已实名用户应显示真实姓名作为名称');
console.log('3. 头像文字应显示名称的首字符');
console.log('4. 实名状态应正确显示');
