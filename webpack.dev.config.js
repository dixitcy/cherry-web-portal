var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        })
    ],
    devServer: {
        noParse: ['/google-libphonenumber/dist/browser/libphonenumber.js'],
		 historyApiFallback: true
    },
    module: {
        noParse: ['/node_modules/google-libphonenumber/dist/*'],
        loaders: [{
            test: /\.js$/,
            loaders: ['react-hot', 'babel'],
            include: path.join(__dirname, 'src')
        }, {
            test: /masonry|fizzy\-ui\-utils|desandro\-|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
            loader: 'imports?define=>false&this=>window'
        },{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' ,include: path.join(__dirname, 'src/images')} ,{
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: path.join(__dirname, 'src')
      }]
    }
};
