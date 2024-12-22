import React from "react";
import Header from "./components/Header";
import Legend from "./components/Legend";
import "./App.css";

import mapImage from "./utilities/map.png";

const App: React.FC = () => {
  return (
    <div className="app-container">
      {/* Top header section */}
      <Header />

      {/* Main content area */}
      <div className="app-content">
        {/* Sidebar for legend */}
        <div className="app-sidebar">
          <Legend />
        </div>

        {/* Main section displaying the map */}
        <div className="app-main">
          <img src={mapImage} alt="Map" className="map-image" />
        </div>
      </div>
    </div>
  );
};

export default App;
