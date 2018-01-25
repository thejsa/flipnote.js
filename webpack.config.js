
"use strict";

const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const version = require("./package.json").version;

module.exports = function (env) {

  var isDevMode = (env == "dev");

  var config = {
    context: path.resolve(__dirname, "src"),
    entry: "./ugomemo.js",
    output: {
      library: "ugomemo",
      libraryTarget: "umd",
      path: path.resolve(__dirname, "dist"),
      filename: isDevMode ? "ugomemo.js" : "ugomemo.min.js",
    },
    resolve: {
      extensions: [".js"],
      alias: {
        "webgl": path.resolve(__dirname, "src/webgl/"),
        "decoder": path.resolve(__dirname, "src/decoder/"),
        "player": path.resolve(__dirname, "src/player/"),
      }
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: [
          "ugomemo.js v" + version,
          "Real-time, browser-based playback of Flipnote Studio's .ppm animation format",
          "2018 James Daniel",
          "github.com/jaames/ugomemo.js",
          "Flipnote Studio is (c) Nintendo Co., Ltd.",
        ].join("\n")
      }),
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(version)
      }),
      new CopyWebpackPlugin([
        {from: "demo/*.ppm"}
      ])
    ],
    devtool: "source-map",
    devServer: {
      port: process.env.PORT || 8080,
      host: "localhost",
      publicPath: "http://localhost:8080",
      contentBase: path.join(__dirname, "./"),
      watchContentBase: true,
    }
  }

  if (!isDevMode) {
    config.plugins = config.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        mangle: {
          props: {
            // Mangle protected properties (which start with "_")
            regex: /^_/
          }
        }
      })
    ]);
  }

  return config;
};