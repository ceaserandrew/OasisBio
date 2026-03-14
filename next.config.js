/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 忽略 Node.js 内置模块，只在服务器端使用
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        module: false,
        os: false,
        path: false,
        url: false,
        process: false,
      };
      
      // 忽略 @prisma/client 模块，只在服务器端使用
      config.externals = {
        ...config.externals,
        '@prisma/client': 'commonjs @prisma/client',
      };
      
      // 处理 server-only 包
      config.module.rules.push({
        test: /server-only/,
        use: {
          loader: 'null-loader',
        },
      });
      
      // 重定向所有 Prisma 相关的导入到空模块
      config.resolve.alias = {
        ...config.resolve.alias,
        '@prisma/client': false,
        '@/generated/prisma/client': false,
        '@/generated/prisma/internal/class': false,
        '@/generated/prisma/internal/prismaNamespace': false,
      };
      
      // 处理 node: 前缀的模块导入
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        {
          apply: (resolver) => {
            resolver
              .getHook('resolve')
              .tapAsync('NodeSchemeResolver', (request, resolveContext, callback) => {
                if (request.request && request.request.startsWith('node:')) {
                  const mod = request.request.replace(/^node:/, '');
                  switch (mod) {
                    case 'child_process':
                    case 'fs':
                    case 'fs/promises':
                    case 'module':
                    case 'os':
                      callback(null, {
                        path: false,
                        external: true,
                      });
                      return;
                    default:
                      request.request = mod;
                      resolver.doResolve(
                        resolver.getHook('resolve'),
                        request,
                        null,
                        resolveContext,
                        callback
                      );
                      return;
                  }
                }
                callback();
              });
          },
        },
      ];
    }
    return config;
  },
  // 禁用字体优化，避免从 Google Fonts 加载
  optimizeFonts: false,
};

module.exports = nextConfig;
