const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserWebpackPlugin = require("terser-webpack-plugin")

const isDevelopment = process.env.NODE_ENV === 'development'

const { PROJECT_ROOT, SOURCE_DIRECTORY, BUILD_DIRECTORY} = require('./webpack-consts.js')

const getOptimization = () => {
	const config = {
		splitChunks: {
		}
	}

	if (!isDevelopment) {
		config.minimizer = [
			new TerserWebpackPlugin(),
		]
	}

	return config
}

const getAppropriateFilename = ext => isDevelopment ? `[name].${ext}` : `[name].[hash].${ext}`

module.exports = () => {
	return {
		mode: isDevelopment ? 'development' : 'production',
		entry: {
			app: SOURCE_DIRECTORY,
		},
		output: {
			path: BUILD_DIRECTORY,
			filename: getAppropriateFilename('js'),
		},
		target: isDevelopment ? "web" : "browserslist",
		watchOptions: {
			ignored: /node_modules/,
		},
		devServer: {
			static: {
				directory: path.join(__dirname, '/public/'),
			},
			static: true,
			historyApiFallback: true,
			port: 8081,
			open: true,
			client: {
		      overlay: true,
			},
		},
		cache: {
			type: 'filesystem'
		},
		devtool: 'source-map',
		module: {
			rules: [{
					test: /\.(js|jsx)$/i,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								"presets": [
									[
										'@babel/preset-react'
									],
									[
										"@babel/preset-env",
										{
											"useBuiltIns": "usage",
											"corejs": "3"
										}
									],
								],
							}
						},
					]
				},
				{
					test: /\.(sa|sc|c)ss$/i,
					exclude: /node_modules/,
					use: [ isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
				},
				{
					test: /\.(gif|png|jpe?g|svg)$/i,
					exclude: /node_modules/,
					type: 'asset/resource',
					generator: {
						filename: 'img/[name][ext]'
					}
				},
				{
					test: /\.(eot|ttf|woff|woff2)$/i,
					exclude: /node_modules/,
					type: 'asset/resource',
					generator: {
						filename: 'fonts/[name][ext]'
					}
				}
			],
		},
		plugins: [
			new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
				template: path.join(__dirname, 'index.html'),
				favicon: "src/assets/images/favicon.png",
				minify: {
					collapseWhitespace: !isDevelopment ? true : false,
				},
				meta: {
					scalable: {
						name: 'viewport',
						content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
					}
				},
			}),
			new MiniCssExtractPlugin({
				filename: getAppropriateFilename('css'),
			}),
		],
		resolve: {
			alias: {
				'@': SOURCE_DIRECTORY,
				'@assets': path.resolve(__dirname, './src/assets'),
				'@consts': path.resolve(__dirname, './src/consts'),
				'@hooks': path.resolve(__dirname, './src/hooks'),
				'@components': path.resolve(__dirname, './src/components'),
				'@store': path.resolve(__dirname, './src/store'),
				'@styles': path.resolve(__dirname, './src/styles'),
				'@utils': path.resolve(__dirname, './src/utils'),
			}
		},
		optimization: getOptimization(),
		stats: {
			children: true,
		}
	}
}