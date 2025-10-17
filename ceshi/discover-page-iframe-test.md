# 发现页面内嵌网站测试文档

## 测试目标
将世桥生物制药有限公司官网 (http://www.sciecure.com/) 内嵌到发现页面中

## 修改内容

### 文件：`touzices-nextjs/src/app/discover/page.tsx`

**修改前：**
- 使用 `srcDoc` 属性内嵌静态HTML内容
- 包含大量内联HTML代码

**修改后：**
- 使用 `src` 属性直接指向外部网站
- 简化代码结构

**具体修改：**
```tsx
// 修改前
<iframe 
  className="web-iframe"
  sandbox="allow-popups allow-top-navigation-by-user-activation allow-scripts allow-modals allow-popups allow-downloads allow-pointer-lock allow-presentation"
  allow="fullscreen; camera; microphone; geolocation"
  referrerPolicy="no-referrer"
  srcDoc={`...大量HTML内容...`}
/>

// 修改后
<iframe 
  className="web-iframe"
  sandbox="allow-popups allow-top-navigation-by-user-activation allow-scripts allow-modals allow-popups allow-downloads allow-pointer-lock allow-presentation"
  allow="fullscreen; camera; microphone; geolocation"
  referrerPolicy="no-referrer"
  src="http://www.sciecure.com/"
/>
```

## 功能说明

### 内嵌网站特性
- **网站地址：** http://www.sciecure.com/
- **公司名称：** 北京世桥生物制药有限公司
- **网站内容：** 包含公司简介、产品展示、新闻中心、研发实力等信息

### 技术实现
- 使用iframe直接加载外部网站
- 保持原有的sandbox安全设置
- 支持全屏、摄像头、麦克风等权限
- 设置no-referrer策略保护隐私

## 测试步骤

1. **启动开发服务器**
   ```bash
   cd touzices-nextjs
   npm run dev
   ```

2. **访问发现页面**
   - 打开浏览器访问 `http://localhost:3000/discover`
   - 检查页面是否正常加载

3. **验证内嵌网站**
   - 确认iframe中显示世桥生物制药官网
   - 检查网站内容是否完整显示
   - 测试网站内的链接和功能是否正常

4. **测试响应式设计**
   - 在不同设备尺寸下测试显示效果
   - 确认网站在移动端和桌面端都能正常显示

## 预期结果

- ✅ 发现页面正常加载
- ✅ 世桥生物制药官网完整内嵌显示
- ✅ 网站内容清晰可见
- ✅ 响应式设计正常工作
- ✅ 无控制台错误

## 注意事项

1. **网络连接：** 需要确保能够访问外部网站
2. **跨域限制：** 某些网站可能有X-Frame-Options限制
3. **加载速度：** 外部网站加载速度可能影响用户体验
4. **内容更新：** 内嵌网站内容会随原网站实时更新

## 完成状态

- [x] 修改发现页面iframe配置
- [x] 设置正确的src属性
- [x] 保持安全设置不变
- [x] 创建测试文档
- [ ] 实际测试验证（需要运行项目）

## 修改时间
2025年1月17日

## 修改人员
AI助手
