import React from "react";
import Header from "./components/Header";
import Legend from "./components/Legend";
import "./App.css";

import mapImage from "./utilities/map.png";

const App: React.FC = () => {
  return (
    <div className="app-container">
      {/* כותרת עליונה */}
      <Header />

      {/* תוכן הדף */}
      <div className="app-content">
        {/* מקרא בצד שמאל */}
        <div className="app-sidebar">
          <Legend />
        </div>

        {/* תוכן מרכזי */}
        <div className="app-main">
          <img src={mapImage} alt="Map" className="map-image" />
        </div>
      </div>
    </div>
  );
};

export default App;
