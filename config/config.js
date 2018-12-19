// https://umijs.org/config/
import config from 'umi_base_config';
// import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import theme from './theme.config';

config.chainWebpack = webpackPlugin;
config.theme = theme;
config.manifest = { basePath: '/' };

delete config.outputPath;
delete config.extraBabelPlugins

export default config;
