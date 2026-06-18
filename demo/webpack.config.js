const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MODE_PROD = "production";
const MODE_DEV = "development";

module.exports = (env) => {
  let mode = env.APP_ENV === "production" ? MODE_PROD : MODE_DEV;
  let devServerPort = env.APP_PORT || 4000;

  return {
    entry: path.resolve(__dirname, "./demo.js"),
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    mode,
    resolve: {
      extensions: [".ts", ".js"],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      hot: false,
      compress: true,
      port: devServerPort,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.ts(x?)$/,
          use: ["babel-loader", "ts-loader"],
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          use: "babel-loader",
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Modal.js Demo",
        template: path.resolve(__dirname, "./index.html"),
      }),
    ],
  };
};
