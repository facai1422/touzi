@echo off
echo 🚀 开始部署到 Netlify...

echo 📋 检查环境...
node --version
npm --version

echo 📦 安装依赖...
npm install

echo 🧹 清理构建文件...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 🔨 构建项目...
npm run build

echo 🔍 检查构建结果...
if exist out (
    echo ✅ 构建成功！
    echo 📁 构建输出目录: out
    echo 📊 构建文件统计:
    dir /s /b out | find /c /v ""
    echo 个文件
) else (
    echo ❌ 构建失败！
    pause
    exit /b 1
)

echo 🔍 检查关键文件...
if exist out\index.html (
    echo ✅ index.html 存在
) else (
    echo ❌ index.html 不存在
)

if exist out\_redirects (
    echo ✅ _redirects 文件存在
) else (
    echo ⚠️  _redirects 文件不存在，正在创建...
    echo /*    /index.html   200 > out\_redirects
)

echo 🎉 准备部署到 Netlify！
echo.
echo 📋 部署选项：
echo 1. 通过 Netlify 网站拖拽 out 目录
echo 2. 使用 Netlify CLI: netlify deploy --prod --dir=out
echo 3. 连接 Git 仓库自动部署
echo.
echo 🔗 Netlify 网站: https://app.netlify.com/drop
echo.
pause
