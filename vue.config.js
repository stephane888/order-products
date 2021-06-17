const envModeDev = process.env.NODE_ENV !== "production";
module.exports = {
  lintOnSave: true,
  chainWebpack: (config) => {
    config.module.rule("eslint").use("eslint-loader").options({
      fix: true,
    });
  },
  //------------https://cli.vuejs.org/config--------------//
  //publicPath: "/",
  //outputDir: "dist",
  assetsDir: envModeDev ? "" : "./",
  //Pour desactiver la generation des fichiers avec des valeurs aleatoires.
  //filenameHashing: true,
  //pour construire une app avec plusieurs pages.
  //pages:undefined,
  css: {
    sourceMap: envModeDev ? true : false,
    /*
    loaderOptions: {
      css: {
        // options here will be passed to css-loader
      },
      postcss: {
        // options here will be passed to postcss-loader
      }
    }
    /**/
  },
};
