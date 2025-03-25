import React, { useState } from "react";
import Header from "../components/Header";
import Legend from "../components/Legend";
import Map from "../components/Map";
import SiteIntro from "../components/SiteIntro";

const Home: React.FC = () => {
  const [activeCommunity, setActiveCommunity] = useState<string | null>(null);

  const communities = [
    { name: "קהילה 1", lat: 32.0853, lon: 34.7818, color: "#5E72E4" },
    { name: "קהילה 2", lat: 31.7683, lon: 35.2137, color: "#3498DB" },
    { name: "קהילה 3", lat: 29.5577, lon: 34.9519, color: "#4CAF50" },
    { name: "קהילה 4", lat: 30.1234, lon: 34.9876, color: "#FF9800" },
    { name: "קהילה 5", lat: 30.6789, lon: 35.1234, color: "#8E44AD" },
  ];

  return (
    <div
      dir="rtl"
      className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-white text-right"
    >
      {/* Header */}
      <Header />

      {/* Site Introduction */}
      <SiteIntro />

      {/* Main layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row-reverse gap-6">
          {/* Map - עכשיו בצד שמאל */}
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-indigo-50 py-3 px-4 border-b border-gray-100">
              <h2 className="font-semibold text-indigo-900">
                מפה אינטראקטיבית
              </h2>
            </div>
            <Map
              communities={communities}
              activeCommunity={activeCommunity}
              setActiveCommunity={setActiveCommunity}
            />
          </div>

          {/* Legend Sidebar - עכשיו בצד ימין */}
          <div className="lg:w-1/4 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-[600px]">
            <div className="bg-indigo-50 py-3 px-4 border-b border-gray-100">
              <h2 className="font-semibold text-indigo-900">רשימת קהילות</h2>
            </div>
            <div className="p-4 h-full">
              <Legend
                communities={communities}
                setActiveCommunity={setActiveCommunity}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
