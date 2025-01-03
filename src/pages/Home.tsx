import React from "react";
import Header from "../components/Header";
import Legend from "../components/Legend";
import mapImage from "../utilities/map.png";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white">
      {/* Top header section */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:flex-row p-4 lg:p-8 gap-6">
        {/* Sidebar for legend */}
        <div className="lg:w-1/4 bg-white rounded-lg shadow-md p-4">
          <Legend />
        </div>

        {/* Main section displaying the map */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={mapImage}
            alt="Map"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
export {};
