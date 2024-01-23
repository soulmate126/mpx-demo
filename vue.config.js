const { defineConfig } = require('@vue/cli-service')
const { resolve } = require('path')
module.exports = defineConfig({
  outputDir: `dist/${process.env.MPX_CURRENT_TARGET_MODE}`,
  pluginOptions: {
    mpx: {
      plugin: {
        srcMode: 'wx',
        hackResolveBuildDependencies: ({ files, resolveDependencies }) => {
          const path = require('path')
          const packageJSONPath = path.resolve('package.json')
          if (files.has(packageJSONPath)) files.delete(packageJSONPath)
          if (resolveDependencies.files.has(packageJSONPath)) {
            resolveDependencies.files.delete(packageJSONPath)
          }
        },
        externalClasses: ['custom-class', 'i-class'],
        transRpxRules: [
          {
            mode: 'all', // 所有样式都启用转换rpx，除了注释为'use px'的样式不转换
            comment: 'use px', // mode为'all'时，默认值为'use px',
            include: resolve('./src')
          }
        ]
      },
      loader: {},
      unocss: {}
    },
    SSR: {
      devClientPort: 8000
    }
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/style/var.scss";'
      }
    }
  },
  /**
   * 如果希望node_modules下的文件时对应的缓存可以失效，
   * 可以将configureWebpack.snap.managedPaths修改为 []
   */
  configureWebpack(config) {},
  chainWebpack(config) {
    if (process.env.MPX_CLI_MODE !== 'web') {
      config.module
        .rule('scss')
        .oneOf('normal')
        .use('sass-loader')
        .tap(() => ({
          sassOptions: { outputStyle: 'compressed' },
          additionalData: "@import '@/style/var.scss';"
        }))
    }
  }
})
