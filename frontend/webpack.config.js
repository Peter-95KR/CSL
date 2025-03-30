// This file is used for webpack 5 polyfills for Node.js core modules
// https://webpack.js.org/configuration/resolve/#resolvefallback

const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer/'),
    },
  },
};