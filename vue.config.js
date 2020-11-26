const path = require('path');
const debug = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const { externalConfig, getExternalModules } = require('./cdnConfig');
const externalModules = getExternalModules(externalConfig);
const cdnConfig = externalConfig
module.exports = {
    outputDir: 'dist', //打包输出目录
    assetsDir: '', // 放置生成的静态资源目录 (默认 js,img,css,fonts),会包裹这些文件夹
    indexPath: 'index.html', // 指定生成的 index.html ,默认为index.html 
    filenameHashing: true, // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
    lintOnSave: false, //eslint-loader 检查在编译时不使用
    runtimeCompiler: false, // 是否使用包含运行时编译器的 Vue 构建版本
    transpileDependencies: [], // babel-loader 会忽略node_modles 中的文件,如果想Babel 显式转译一个依赖，可以在这个选项中列出来
    productionSourceMap: false, //如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建(.map文件)
    crossorigin: undefined, // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。需要注意的是该选项仅影响由 html-webpack-plugin 在构建时注入的标签 - 直接写在模版 (public/index.html) 中的标签不受影响必须为anonymous, use-credentials
    integrity: false, //用来减少由「托管在 CDN 的资源被篡改」
    pages: { // default :undefined
        index: {
            entry: 'src/main.js', // page 入口 一般为main.js
            template: 'public/index.html', // 模板来源
            filename: 'index.html', // 打包输出文件,
            title: '智简运维', //template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            chunks: ['chunk-vendors', 'chunk-common', 'index'], //提取出来的通用 chunk 和 vendor chunk。
            cdnConfig: debug ? [] : cdnConfig
        }
    },
    configureWebpack: config => { //调整 webpack 配置,通过 webpack-merge 合并到最终的配置中
        // webpack 的配置合并在config上就可以了 HtmlWebpackPlugin
        if (debug) {
            // 开发环境配置
            config.externals = {
                // 'AMap': 'AMap',
            };
        } else {
            // 生产环境配置
            config.externals = {
                // 'AMap': 'AMap',
                ...externalModules
            };
        }
        // 其他拓展配置
        Object.assign(config, {
            resolve: {
                ...config.resolve,
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    'vue$': 'vue/dist/vue.esm.js'
                }
            },
            plugins: [
                ...config.plugins,
                // new webpack.ProvidePlugin({
                //     jQuery: 'jquery',
                //     $: 'jquery',
                //     'window.jQuery': 'jquery'
                // }),
            ],
        })

    },
    chainWebpack: config => { //是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例
        //    config.use('htmlWebpackPlugin').pages.index.mm='llllll'
        if (debug) {
            // 开发环境
        } else {
            // 生产环境
        }
    },
    pluginOptions: { //  第三方插件配置
        // 'process.env':{
        //     NODE_ENV:'"development"'
        // }
    },

    css: {
        requireModuleExtension: true,

    },
    devServer: { // 开发环境下的配置
        open: true,
        // host: "19",
        port: '8088',
        // 支持webpack 下的所有devServer的配置
        // 一般使用静态代理
        proxy: {
            '/api': {
                target: 'http://localhost:7001',
                ws: true,
                changeOrigin: true
            },
        }
    },
    parallel: require('os').cpus().length > 1, // 是否在处理器内核大于1的时候使用进程加载器

}