const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      'react-native-vector-icons': path.resolve(
        __dirname,
        'node_modules/react-native-vector-icons',
      ),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
