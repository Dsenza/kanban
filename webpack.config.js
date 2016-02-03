const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build')
};

const common = {
	// Entry accepts a path or an object of entries.
	// The build chapter contains an example of the latter.
	entry: [
		'webpack-dev-server/client?http://localhost:3000',
		'webpack/hot/only-dev-server',
		PATHS.app
	],

	// Add resolve.extensions.
	// '' is needed to allow imports without an extension.
	// Note the .'s before the extensions as it will fail to match without.
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		path: PATHS.build,
		filename: 'bundle.js',
		publicPath: '/static/'
	},

	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				loaders: ['eslint'],
				includes: PATHS.app
			}
		],
		loaders: [
			{
				// Test expects a RegExp!
				test: /\.css$/,
				loaders: ['style', 'css'],
				// Include accepts either a path or an array of paths.
				include: PATHS.app
			},
			// Set up jsx. This accepts js as well thanks to RegExp
			{
				test: /\.jsx?$/,
				// Enable caching for improved performace during development.
				loaders: ['react-hot', 'babel?cacheDirectory'],
				include: PATHS.app
			}
		]
	}
};

// Default configuration
if(TARGET === 'start' || !TARGET) {
	module.exports = merge(common, {

		devtool: 'eval-source-map',
		devServer: {
    		contentBase: PATHS.build,

      		// Enable history API fallback so HTML5 History API based
      		// routing works. This is a good default that will come
     		// in handy in more complicated setups.
      		historyApiFallback: true,
      		hot: true,
      		inline: true,
      		progress: true,

	     	// Display only errors to reduce the amount of output.
	      	stats: 'errors-only',

	      	// Parse host and port from env so this is easy to customize.
	      	host: process.env.HOST,
	      	port: 3000
    	},
		plugins: [
			new webpack.HotModuleReplacementPlugin()
		]
	});
}

if(TARGET === 'build') {
	module.exports = merge(common, {});
}