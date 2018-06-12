const path = require('path');
const webpack = require('webpack');
const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/client/dist');

const client = {
  entry: `${SRC_DIR}/App.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  }
};

// const server = {
//   entry: `${SRC_DIR}/AppServer.jsx`,
//   target: 'node',
//   output: {
//     path: DIST_DIR,
//     filename: 'server-bundle.js',
//     libraryTarget: 'commonjs-module'
//   },
//   module: {
//     rules: [
//       {
//         test: /\.jsx?/,
//         include: SRC_DIR,
//         loader: 'babel-loader',
//         query: {
//           presets: ['react', 'es2015'],
//         },
//       },
//       {
//         test: /\.css$/,
//         use: [
//           {
//             loader: 'isomorphic-style-loader',
//           },
//           {
//             loader: 'css-loader',
//             options: {
//               modules: true,
//               // importLoaders: 1,
//               localIdentName: '[name]__[local]___[hash:base64:5]',
//               sourceMap: true,
//             },
//           },
//         ],
//       },
//       {
//         test: /\.(png|jpg|gif)$/,
//         use: [
//           {
//             loader: 'url-loader',
//             options: {
//               limit: 8192
//             }
//           }
//         ]
//       }
//       ],
//     }
//   }

  const common = {
    module: {
      rules: [{
        test: /\.jsx?/,
        include: SRC_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        },
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
    ],
  }
};

module.exports = [
  Object.assign({}, common, client),
  // Object.assign({}, server)
];