const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

const src = path.join(__dirname, './src');
const buildOutputPath = path.join(__dirname, './dist');
const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';
const isDev = env === 'development';

require('dotenv').config();

function styleLoaders (loaders, extract) {
  return extract ? ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: loaders,
    publicPath: '/dist'
  }) : [{ loader: 'style-loader' }].concat(loaders);
}

const config = {
  entry: {
    app: [
      src + '/index.js'
    ]
  },

  output: {
    path: buildOutputPath,
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].[hash].js'
  },

  devServer: {
    historyApiFallback: {
      hot: true,
      rewrites: [
        { from: /./, to: 'index.html' },
      ]
    },
  },

  plugins: [
    new CleanWebpackPlugin(['./dist'], {
      root: path.join(__dirname, './'),
      verbose: true,
      dry: false
    }),
    new ExtractTextPlugin({
      filename: 'style.css',
      disable: false,
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `'${ env }'`,
        BROWSER: JSON.stringify(true),
        __DEBUG__: (env !== 'production'),
        FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
        FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
        FIREBASE_DATABASE_URL: JSON.stringify(process.env.FIREBASE_DATABASE_URL),
        FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
        FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
        YOUTUBE_API_KEY: JSON.stringify(process.env.YOUTUBE_API_KEY),
      }
    }),
    new webpack.NamedModulesPlugin()
  ],

  resolve: {
    extensions: ['.js', '.sass', '.scss'],
    modules: [
      src,
      'node_modules'
    ]
  },

  devtool: isProd ? false : 'inline-source-map',

  module: {
    noParse: [
      /\.DS_Store$/,
      /node_modules\/method/
    ],
    rules: [
      { test: /\.s(c|a)ss$/,
        exclude: [/dist/],
        use: styleLoaders([{
          loader: 'css-loader?minimize'
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: () => [ autoprefixer({ browsers: ['last 2 version'] }) ]
          }
        }, {
          loader: 'sass-loader?indentedSyntax'
        }], !isDev)
      },
      { test: /\.css$/, loader: styleLoaders('css-loader?minimize', !isDev) },
      { test: /\.js$/, exclude: [/node_modules/, /dist/], loaders: [
        'react-hot-loader/webpack',
        'babel-loader?cacheDirectory=true'
      ] },
      { test: /\.(png|jpg|gif)$/, loader: 'file-loader?name=[path][name].[ext]?[hash]' },
      { test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'file-loader?name=fonts/[name].[ext]?[hash]?limit=100000' },
      { test: /\.html$/, loader: 'html-loader' }
    ]
  }
};

if (isProd) {
  // Add UglifyJS
  config.plugins = config.plugins.concat([
    // Stop modules with syntax errors from being emitted.
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      mangle: false,
      removeRedundantAttributes: false,
      compress: {
        dead_code: true,
        drop_console: true
      },
      compressor: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ]);
} else {
  config.entry.app = [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080'
  ].concat(config.entry.app);

  config.plugins = config.plugins.concat([
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ]);
}

module.exports = config;
