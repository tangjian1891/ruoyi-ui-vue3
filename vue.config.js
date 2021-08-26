const path = require("path");
const { ProvidePlugin } = require("webpack");
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
        target: `http://10.10.0.77:8083/`,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "",
        },
      },
    },
    disableHostCheck: true,
  },
  configureWebpack: config => {
    config.resolve.fallback = {
      path: require.resolve("path-browserify"),
    };
    config.plugins.push(
      new ProvidePlugin({
        process: "process/browser",
      }),
    );
  },

  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test

    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(path.resolve("src/assets/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(path.resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
};
