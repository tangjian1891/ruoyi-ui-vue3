// const path = require("path");
module.exports = {
  // resolve: {
  //   // fallback: { path: require.resolve("path-browserify") },
  //   fallback: { path: false },
  // },
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://vue.ruoyi.vip/prod-api/`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    disableHostCheck: true
  },
  configureWebpack:config=>{
    config.resolve.fallback={ path: false }
  }
};
