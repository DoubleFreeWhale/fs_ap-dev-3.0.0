const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
function addStyleResource (rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, 'src/assets/css/default.less'),
            ],
        })
}
module.exports = {
    publicPath:'/ap/',
    assetsDir:'static',
    outputDir:'dist/ap',
    lintOnSave:false,
    productionSourceMap:false,
    runtimeCompiler:true,
    pages: {
        index: {
            // pages 的入口
            entry: 'src/pages/index/main.js',
            // 模板来源
            template: 'src/pages/index/index.html',
            // 在 dist/apps.html 的输出
            filename: 'index.html',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        login: {
            // pages 的入口
            entry: 'src/pages/login/main.js',
            // 模板来源
            template: 'src/pages/login/login.html',
            // 在 dist/apps.html 的输出
            filename: 'login.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            // title: 'login',

        },
        designer:{
            entry: 'src/pages/home_designer/main.js',
            // 模板来源
            template: 'src/pages/home_designer/index.html',
            // 在 dist/apps.html 的输出
            filename: 'designer/index.html',
        },
        designerTemplateindex:{
            entry: 'src/pages/template_designer/index/main.js',
            // 模板来源
            template: 'src/pages/template_designer/index/index.html',
            // 在 dist/apps.html 的输出
            filename: 'template_designer/index.html',
        },
        designerTemplatebody:{
            entry: 'src/pages/template_designer/designer/main.js',
            // 模板来源
            template: 'src/pages/template_designer/designer/index.html',
            // 在 dist/apps.html 的输出
            filename: 'template_designer/designer.html',
        },
    },
    "chainWebpack": config => {
        config
            .entry('index')
            .add('babel-polyfill');
        config.resolve.alias
            .set('@', resolve('src'))
            .set('public',resolve('public'))
            .set('fs-element',resolve('src/fs-element'))
            .set('ifbp-element',resolve('src/fs-element'))
            .set('element-ui',resolve('src/fs-element'))
            .set('fs-business',resolve('src/fs-business'));
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    },
    configureWebpack:config=> {
        //打包的时候对js与css文件进行gzip压缩
        if( process.env.NODE_ENV==='production'){
           return {
               plugins:[
                   new CompressionPlugin({
                       test:/\.js$|\.css/,
                       threshold: 10240,
                       deleteOriginalAssets: false
                   }),
                   new UglifyJsPlugin({
                       uglifyOptions: {
                           compress: {
                               // warnings: false,
                               drop_debugger: true,
                               drop_console: true
                           }
                       },
                       // sourceMap: false,
                       // parallel: true
                   }),
               ]
           }
        }
    },
    devServer: {
        proxy: {
            '/': {     //这里最好有一个 /
                // target: 'http://39.107.94.38:8001',  // 后台接口域名
                target: 'http://39.107.94.38:9002',  // 后台接口域名
                ws: false,        //如果要代理 websockets，配置这个参数
                secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
            },
        }
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins:[
                  require('postcss-salad')({
                      "browsers": ["ie > 8", "last 2 versions"],
                      "features": {
                          "bem": {
                              "shortcuts": {
                                  "component": "b",
                                  "modifier": "m",
                                  "descendent": "e"
                              },
                              "separators": {
                                  "descendent": "__",
                                  "modifier": "--"
                              }
                          }
                      }
                  })
                ],
            }
        }
    }
};