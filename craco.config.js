module.exports = {
    webpack: {
      configure: {
        module: {
          rules: [
            {
              test: /\.css$/i,
              use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
          ],
        },
      },
    },
  };