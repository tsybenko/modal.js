const path = require('path');
const MODE_PROD = 'production';
const MODE_DEV = 'development';

const devServer = require('./devserver.config');

module.exports = (env) => {
	let mode = env.production === 'true'
		? MODE_PROD
		: MODE_DEV;

	return {
		entry: './src/index.ts',
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, 'dist'),
			library: "Modal"
		},
		mode,
		resolve: {
			extensions: [ '.ts', '.js' ],
		},
		devServer,
		module: {
			rules: [
				{
					test: /\.ts(x?)$/,
					exclude: /node_modules/,
					loaders: [
						"babel-loader",
						"ts-loader"
					],
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: "babel-loader"
				}
			],
		}
	}
};