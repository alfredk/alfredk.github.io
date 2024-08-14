const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sass = require('sass');
const globImporter = require("node-sass-glob-importer");
const autoprefixer = require("autoprefixer");
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = () => {
  // Define theme path
  const themePath = path.join(__dirname, '/');

  // Define dist path
  const distPath = themePath + '/';
  const config = {
    entry: {
      main: themePath + "index.js",
    },
    output: {
      // Built files go here
      filename: "app.js",
      path: distPath,
      publicPath: "",
    },
    module: {
      // All the rules that will be applied to your files.
      rules: [
        {
          // Handle Javascript
          test: /\.js$/,
          include: themePath,
          use: {
            loader: "babel-loader",
          },
        },
        {
          // Handle raster images without srcset and non-inline SVGs
          test: /\.(png|jpe?g|(?<!inline\.)svg)$/,
          use: [
            {
              // Use data-URI for small images.
              // This falls back to (and therefore accepts options for)
              // file-loader.
              loader: "url-loader",
              options: {
                limit: 4 * 1024, // 4kB limit
                name: "[name].[ext]",
                outputPath: "images",
              },
            },
            {
              loader: "img-loader",
              options: {
                enabled: false, // Optimize only in production/stage mode (it's slow)
                svgo: {
                  plugins: [
                    {
                      removeViewBox: false,
                      cleanupIDs: true,
                    },
                  ],
                },
                outputPath: "images",
              },
            },
          ],
        },
        {
          // Handle styles
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader, // Extract to files on build, load as style tag for dev server
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
                sourceMap: true,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true
              },
            },
            {
              // Compile Sass to CSS
              loader: "sass-loader",
              options: {
                sourceMap: true
              },
            },
          ],
        },
        {
          // Handle styles
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader, // Extract to files on build, load as style tag for dev server
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                importLoaders: 2
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts",
            },
          },
        },
        {
          test: /\.(html)$/,
          use: {
            loader: "html-loader",
            options: {
              interpolate: true,
              minimize: false,
              attrs: ["img:src", "link:href", "image:xlink:href"],
            },
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "style.css",
      }),
      new BrowserSyncPlugin(
        {
          // browse to http://SITEURL:3000/ during development
          host: "localhost//alfredk.github.io/index.html",
          port: 80,
          // proxy the Webpack Dev Server endpoint (which should be serving on http://localhost:3100/) through BrowserSync
          proxy: "localhost//alfredk.github.io/index.html",
          files: [
            {
              match: ["**/*.html", "**/*.php", "**/*.twig", "**/*.css"],
            },
          ],
          injectChanges: true,
        },
        {
          reload: true,
          injectCss: true,
        }
      ),
    ]
  };

  // If in development mode, add eslint
  config.devtool = "source-map";
  // config.module.rules.push({
  //   enforce: 'pre',
  //   test: /\.js$/,
  //   include: themePath,
  //   loader: 'eslint-loader',
  // });
  return config;
};
