const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    lintOnSave: true,
    chainWebpack: (config)=>{
        config.resolve.symlinks(true);
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('page',resolve('src/page'))
            .set('components',resolve('src/components'))
            .set('api',resolve('src/api'))
            .set('router',resolve('src/router'))
            .set('page',resolve('src/components/page'))
    },
    devServer: {
        proxy: {
            '/admin':{
                target:'http://127.0.0.1:8360/admin',
                changeOrigin:true,
                pathRewrite:{
                    '/admin':''
                }
            }
        }
    },
}