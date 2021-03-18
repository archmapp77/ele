const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BabiliPlugin = require('babili-webpack-plugin')
// A Webpack Plugin for Babili - A babel based minifier
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	module: {
		rules: [
			// {
			//  test: /\.css$/,
			//   use: [MiniCssExtractPlugin.loader, 'css-loader'],
			// },
			{
				test: /\.(scss|sass|css)$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.jsx?$/,
				use: [{ loader: 'babel-loader', query: { compact: false } }],
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
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: 'bundle.css',
			chunkFilename: '[id].css',
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		new BabiliPlugin(),
		new webpack.ProvidePlugin({
			$$: '../../js/shortJS.js',
			bulmaQuickview: '../../js/bulma-quickview.min.js',
		}),
	],

	devtool: 'cheap-source-map',
	stats: {
		colors: true,
		children: false,
		chunks: false,
		modules: false,
	},
}
