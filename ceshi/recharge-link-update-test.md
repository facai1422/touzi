# 充值按钮链接更新测试文档

## 更新目标
将充值按钮的客服链接从 `https://chat.boltcode.vip` 更新为 `https://chat2.boltcode.vip`

## 修改内容

### 更新的文件列表

#### 1. 首页充值按钮 ✅
**文件**: `touzices-nextjs/src/app/page.tsx`
**修改前**: `https://chat.boltcode.vip?visiter_id=&visiter_name=&avatar=&business_id=1&groupid=0&special=1`
**修改后**: `https://chat2.boltcode.vip?visiter_id=&visiter_name=&avatar=&business_id=1&groupid=0&special=1`

#### 2. 个人资料页面充值按钮 ✅
**文件**: `touzices-nextjs/src/app/profile/page.tsx`
**修改前**: `https://chat.boltcode.vip?visiter_id=&visiter_name=&avatar=&business_id=1&groupid=0&special=1`
**修改后**: `https://chat2.boltcode.vip?visiter_id=&visiter_name=&avatar=&business_id=1&groupid=0&special=1`

#### 3. 财务页面充值按钮 ✅
**文件**: `touzices-nextjs/src/app/finance/page.tsx`
**修改前**: `https://chat.boltcode.vip?visiter_id=&visiter_name=&avatar=&business_id=1&groupid=0&special=1`
**修改后**: `https://chat2.boltcode.vip?visiter_id=&visiter_name=&avatar=&business_id=1&groupid=0&special=1`

#### 4. 测试文档更新 ✅
**文件**: `touzices-nextjs/ceshi/recharge-button-test.md`
**修改内容**: 更新了文档中所有的链接引用

## 技术实现

### 修改方式
使用 `search_replace` 工具精确替换所有相关链接：

```bash
# 替换模式
https://chat.boltcode.vip → https://chat2.boltcode.vip
```

### 保持不变的参数
- `visiter_id=` (空值)
- `visiter_name=` (空值)  
- `avatar=` (空值)
- `business_id=1`
- `groupid=0`
- `special=1`

## 测试步骤

### 1. 启动项目
```bash
cd touzices-nextjs
npm run dev
```

### 2. 测试充值按钮
1. **首页测试**
   - 访问 `http://localhost:3000/`
   - 点击快捷操作中的"充值"按钮
   - 验证是否打开新链接：`https://chat2.boltcode.vip?...`

2. **个人资料页面测试**
   - 访问 `http://localhost:3000/profile`
   - 点击"交易操作"下的"充值"按钮
   - 验证是否打开新链接：`https://chat2.boltcode.vip?...`

3. **财务页面测试**
   - 访问 `http://localhost:3000/finance`
   - 点击"充值"标签按钮
   - 验证是否打开新链接：`https://chat2.boltcode.vip?...`

### 3. 验证链接功能
- 确认新链接能够正常打开
- 验证客服系统是否正常工作
- 检查参数传递是否正确

## 预期结果

- ✅ 所有充值按钮都指向新的客服链接
- ✅ 链接在新标签页中正确打开
- ✅ 客服系统参数完整传递
- ✅ 用户体验保持一致
- ✅ 无JavaScript错误

## 修改对比

### 链接变化
```
旧链接: https://chat.boltcode.vip?visiter_id=&visiter_name=&avatar=&business_id=1&groupid=0&special=1
新链接: https://chat2.boltcode.vip?visiter_id=&visiter_name=&avatar=&business_id=1&groupid=0&special=1
```

### 功能保持不变
- 点击行为：在新标签页打开
- 参数传递：完整的客服系统参数
- 用户体验：视觉和交互保持一致

## 完成状态

- [x] 更新首页充值按钮链接
- [x] 更新个人资料页面充值按钮链接  
- [x] 更新财务页面充值按钮链接
- [x] 更新测试文档中的链接引用
- [x] 验证所有修改正确应用
- [ ] 实际功能测试（需要运行项目）

## 修改时间
2025年1月17日

## 修改人员
AI助手

## 备注
此次更新仅修改了客服链接的域名部分，从 `chat.boltcode.vip` 更改为 `chat2.boltcode.vip`，其他所有参数和功能保持不变。
