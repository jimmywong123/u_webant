// https://umijs.org/config/
import os from 'os';
// import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import theme from './theme.config';

export default {
  // add for transfer to umi
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        targets: {
          ie: 11,
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
        },
        history: 'hash',
        ...(!process.env.TEST && os.platform() === 'darwin' ?
          {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: true,
          } :
          {}),
      },
    ],
    // google 分析
    // [ 
    //   'umi-plugin-ga',
    //   {
    //     code: 'UA-72788897-6',
    //     judge: () => process.env.APP_TYPE === 'site',
    //   },
    // ],
  ],
  targets: {
    ie: 11,
  },
  proxy: {
    '/api/v1': {
      target: "http://127.0.0.1:7101",
      changeOrigin: true,
      pathRewrite: {
        "^/api/v1": "/api/v1"
      }
    },
  },
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // 路由配置
  // routes: pageRoutes,

  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme,
  // G2 图表时使用 http://antv.alipay.com/zh-cn/g2/3.x/tutorial/data-set.html
  // externals: {
  //   '@antv/data-set': 'DataSet',
  // },

  ignoreMomentLocale: true, // 忽略 moment 的 locale 文件，用于减少尺寸。
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('u.webant.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `u_webant${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },

  chainWebpack: webpackPlugin,
  cssnano: {
    mergeRules: false,
  },

  // extra configuration for egg
  runtimePublicPath: true, // 值为 true 时使用 HTML 里指定的 window.publicPath。
  hash: true,
  // 配置后会生成 manifest.json，option 传给 https://www.npmjs.com/package/webpack-manifest-plugin。 比如：
  // manifest: {
  //   fileName: '../../config/manifest.json',
  //   publicPath: '',
  // },
  manifest: {
    basePath: '/',
  },
};
