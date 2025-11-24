#!/bin/bash

# Netlify 部署脚本
echo "🚀 开始部署到 Netlify..."

# 检查 Node.js 版本
echo "📋 检查环境..."
node --version
npm --version

# 安装依赖
echo "📦 安装依赖..."
npm install

# 清理之前的构建
echo "🧹 清理构建文件..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ -d "out" ]; then
    echo "✅ 构建成功！"
    echo "📁 构建输出目录: out"
    echo "📊 构建文件统计:"
    find out -type f | wc -l
    echo "个文件"
else
    echo "❌ 构建失败！"
    exit 1
fi

# 检查关键文件
echo "🔍 检查关键文件..."
if [ -f "out/index.html" ]; then
    echo "✅ index.html 存在"
else
    echo "❌ index.html 不存在"
fi

if [ -f "out/_redirects" ]; then
    echo "✅ _redirects 文件存在"
else
    echo "⚠️  _redirects 文件不存在，正在创建..."
    echo "/*    /index.html   200" > out/_redirects
fi

echo "🎉 准备部署到 Netlify！"
echo ""
echo "📋 部署选项："
echo "1. 通过 Netlify 网站拖拽 out 目录"
echo "2. 使用 Netlify CLI: netlify deploy --prod --dir=out"
echo "3. 连接 Git 仓库自动部署"
echo ""
echo "🔗 Netlify 网站: https://app.netlify.com/drop"
