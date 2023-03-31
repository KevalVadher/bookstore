module.exports = {
	entry: {
		server: "./server.js"
	},
	target: "node",
	output: {
		path: __dirname + "/build",
		filename: "[name].js",
		chunkFilename: "[id].bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	},
	resolveLoader: {
		modules: [__dirname + "/node_modules"]
	},
	node: {
		__dirname: true
	},
	externals: {
		uws: "uws",
		yamlparser: "yamlparser"
	},
	optimization: {
		minimize: false,
		emitOnErrors: true
	}
};