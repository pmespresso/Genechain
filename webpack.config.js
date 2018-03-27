const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");
const path = require('path');
var nodeExternals = require('webpack-node-externals');

const browserConfig = {
  entry: "./src/browser/index.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: "file-loader",
        options: {
          name: "public/media/[name].[ext]",
          publicPath: url => url.replace(/public/, "")
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: "css-loader",
              options: { importLoaders: 1 }
            },
            {
              loader: "postcss-loader",
              options: { plugins: [autoprefixer()] }
            }
          ]
        })
      },
      {
        test: /js$/,
        use: [
          {
            loader: "babel-loader"
          }
        ],
        exclude: /node_modules/
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "public/css/[name].css"
    })
  ]
}

const serverConfig = {
  entry: "./src/server/index.js",
  target: "node",
  output: {
    path: __dirname,
    filename: "server.js",
    libraryTarget: "commonjs2"
  },
  externals: [nodeExternals()],
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: "file-loader",
        options: {
          name: "public/media/[name].[ext]",
          publicPath: url => url.replace(/public/, ""),
          emit: false
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "css-loader/locals"
          }
        ]
      },
      {
        test: /js$/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  }
};

module.exports = [browserConfig, serverConfig];
