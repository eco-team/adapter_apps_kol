const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: ["./src/main.js", "./src/scss/bundle.scss"],
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "dist/",
    filename: "build.js"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            scss:
              "vue-style-loader!css-loader!sass-loader?outputStyle=compressed",
            sass:
              "vue-style-loader!css-loader!sass-loader?outputStyle=compressed"
          }
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [ // use `include` vs `exclude` to white-list vs black-list
          path.resolve(__dirname, "src"), // white-list your app source files
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "file-loader",
        options: {
          limit: 5000,
          name: "images/[name].[ext]?[hash:12]"
        }
      },
      {
        test: /\.(ttf|otf|woff|eot|svg)$/,
        loader: "url-loader",
        options: {
          limit: 1000,
          name: "fonts/[name].[ext]"
        }
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        loaders: [
          "style-loader",
          "css-loader",
          "sass-loader?outputStyle=compressed"
        ]
      }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    host: "localhost",
    // port: 8000
  },
  performance: {
    hints: false
  },
  devtool: "#eval-source-map",
  plugins: [
    new VueLoaderPlugin(),
    new Dotenv({
      path: './.env', // Path to .env file (this is the default)
      // safe: true // load .env.example (defaults to "false" which does not use dotenv-safe)
    })
  ]
};
