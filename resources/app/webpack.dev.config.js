const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { spawn } = require('child_process')

module.exports = {
	module: {
		rules: [
			// {
			//  test: /\.css$/,
			//  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
			// },
			{
				test: /\.(scss|sass|css)$/i,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.jsx?$/,
				use: [{ loader: 'babel-loader' }],
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: [
					{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' },
				],
			},
		],
	},
	target: 'electron-renderer',

	plugins: [
		new HtmlWebpackPlugin({ title: 'BugLogger' }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development'),
		}),
		new webpack.ProvidePlugin({
			$$: '../../js/shortJS.js',
			bulmaQuickview: '../../js/bulma-quickview.min.js',
		}),
	],

	devtool: 'cheap-source-map',
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		stats: {
			colors: true,
			chunks: false,
			children: false,
		},
		before() {
			spawn('electron', ['.'], {
				shell: true,
				env: process.env,
				stdio: 'inherit',
			})
				.on('close', (code) => process.exit(0))
				.on('error', (spawnError) => console.error(spawnError))
		},
	},
}
