import React, { useState } from "react";
import Header from "../components/Header";
import Legend from "../components/Legend";
import Map from "../components/Map";

const Home: React.FC = () => {
  const [activeCommunity, setActiveCommunity] = useState<string | null>(null);

  const communities = [
    { name: "Community 1", lat: 32.0853, lon: 34.7818, color: "#ff6666" },
    { name: "Community 2", lat: 31.7683, lon: 35.2137, color: "#66b3ff" },
    { name: "Community 3", lat: 29.5577, lon: 34.9519, color: "#99ff99" },
    { name: "Community 4", lat: 30.1234, lon: 34.9876, color: "#ffcc66" },
    { name: "Community 5", lat: 30.6789, lon: 35.1234, color: "#ff99ff" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white">
      {/* Top header section */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:flex-row p-4 lg:p-8 gap-6">
        {/* Sidebar for legend */}
        <div className="lg:w-1/4 bg-white rounded-lg shadow-md p-4">
          <Legend
            communities={communities}
            setActiveCommunity={setActiveCommunity}
          />
        </div>

        {/* Main section displaying the map */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <Map
            communities={communities}
            activeCommunity={activeCommunity}
            setActiveCommunity={setActiveCommunity}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
export {};
