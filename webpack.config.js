const path = require('path');

module.exports = {
	entry: {}, // Assigned in gulp
	resolve: {
		modules: [path.join(__dirname, 'node_modules')],
		extensions: ['.js', '.jsx', '.json']
	},
	output: {
		filename: '[name].js'
	},
	plugins: [], // Assigned in gulp
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: [
						[require.resolve('babel-preset-env'), {
							targets: {
								browsers: ['last 2 versions', 'ie >= 9', 'ios_saf >= 8', 'Android >= 4.3', '> 1%']
							},
							modules: false
						}],
						require.resolve('babel-preset-react')
					]
				}
			}
		]
	}
};
