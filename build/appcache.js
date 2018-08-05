const AppCachePlugin = require('appcache-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')


module.exports.AppCachePlugin =
  new AppCachePlugin({
    // cache: files,
    network: ['*'],
    // fallback: ['failwhale.jpg'],
    // settings: ['prefer-online'],
    // exclude: ['file.txt'],  // Exclude file.txt and all .js files
    output: 'appcache.manifest'
  });

module.exports.replaceHeadMadifest =
  new HtmlReplaceWebpackPlugin([
    {
      pattern: 'data-manifest',
      replacement: 'manifest'
    }
  ]);
