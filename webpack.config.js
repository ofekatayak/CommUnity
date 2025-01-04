module.exports = {
  // ההגדרות האחרות
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules\/plotly\.js/,
      },
    ],
  },
  resolve: {
    alias: {
      "plotly.js/dist/maplibre-gl-unminified.js.map": false,
    },
  },
};
