module.exports = {
  // ההגדרות הקיימות האחרות שלך נשארות כאן

  // הוספת חוקי module
  module: {
    rules: [
      // כל הכללים הקיימים שלך יישארו

      // התאמת source-map-loader כדי להתעלם מקבצי plotly.js
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules\/plotly\.js/,
      },
    ],
  },

  // התעלמות מאזהרות ספציפיות
  ignoreWarnings: [
    {
      module: /node_modules\/plotly\.js/,
      message: /Failed to parse source map/,
    },
  ],

  // הגדרת alias כדי לעקוף את קבצי המפות החסרים
  resolve: {
    alias: {
      "plotly.js/dist/maplibre-gl-unminified.js.map": false,
    },
    fallback: {
      // אם יש שגיאות של חבילות Node חסרות, להוסיף כאן
      // "stream": false,
      // "path": false,
    },
  },

  // אפשרויות נוספות לייעול
  performance: {
    hints: false, // מבטל אזהרות על גודל קבצים
  },
};
