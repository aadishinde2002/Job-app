// module.exports = {
//   presets: ['module:@react-native/babel-preset'], 
//   env: {
//     production: {
//       plugins: ['react-native-paper/babel'],
//     },
//   },
// };

// module.exports = {
//   "presets": ["module:metro-react-native-babel-preset"],
//   "plugins": [["@babel/plugin-proposal-decorators", { "legacy": true }]]
// }

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
  env: {
    production: {
      plugins: [
        'react-native-paper/babel', 
      ],
    },
  },
};

