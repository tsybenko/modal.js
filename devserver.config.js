const path = require('path');

const data = {
	posts: require('./data/posts.json')
};

const routes = [
	['/posts', (req, res) => res.json(data.posts)]
];

const devServer = {
	hot: false,
	contentBase: [
		path.join(__dirname, 'docs'),
		path.join(__dirname, 'dist')
	],
	index: "index.html",
	compress: true,
	port: 4000,
	before: (app, server) => {
		routes.map(route => {
			let [path, handler] = route;
			app.get(path, handler);
		});
	},
	// after: (app, server) => {
	// 	console.log(app);
	// 	console.log(server);
	// }
};

module.exports = devServer;