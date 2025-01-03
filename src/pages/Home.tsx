import React from "react";
import Header from "../components/Header";
import Legend from "../components/Legend";
import "./css/Home.css";
import mapImage from "../utilities/map.png";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Top header section */}
      <Header />

      {/* Main content area */}
      <div className="home-content">
        {/* Sidebar for legend */}
        <div className="home-sidebar">
          <Legend />
        </div>

        {/* Main section displaying the map */}
        <div className="home-main">
          <img src={mapImage} alt="Map" className="map-image" />
        </div>
      </div>
    </div>
  );
};

export default Home;
export{};