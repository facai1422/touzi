import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 禁用Turbopack以解决HMR问题
  experimental: {
    turbo: {
      // 禁用Turbopack的某些功能以避免HMR冲突
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // 配置webpack以解决模块解析问题
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 在开发模式下禁用某些优化以避免HMR问题
      config.optimization = {
        ...config.optimization,
        splitChunks: false,
      };
    }
    return config;
  },
  // 配置编译器选项
  compiler: {
    // 移除console.log在生产环境
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 配置输出 - 适配Netlify
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 配置重定向
  async redirects() {
    return [];
  },
  // 配置重写
  async rewrites() {
    return [];
  },
};

export default nextConfig;
