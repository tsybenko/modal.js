const path = require("path");
const MODE_PROD = "production";
const MODE_DEV = "development";

module.exports = (env) => {
  let mode = env.APP_ENV === "production" ? MODE_PROD : MODE_DEV;

  return {
    entry: "./src/index.ts",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      library: "Modal",
    },
    mode,
    resolve: {
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
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
  };
};
