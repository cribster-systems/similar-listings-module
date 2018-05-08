var path = require('path');
var SRC_DIR = path.join(__dirname, '/client/src');
var DIST_DIR = path.join(__dirname, '/client/dist');

module.exports = {
  entry: `${SRC_DIR}/App.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  module: {
    rules: [
        {
          test: /\.jsx?$/,
          include: SRC_DIR,
          loader: "babel-loader",
          options: {
              presets: ["es2015", "react"]
          }
      
        },
        {
          test: /\.css$/,
          include: SRC_DIR,
          use: [
            {
               loader: 'style-loader',
            },
            {
               loader: 'css-loader',
               options: {
                  sourceMap: true,
                  modules: true,
                  localIdentName: '[local]___[hash:base64:5]'
                 }
            }
            ],
        }, 
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        }
    ]
}
};