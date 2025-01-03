import React, { useState } from "react";
import Popup from "./popups/Popup";

const Legend: React.FC = () => {
  const [activeCommunity, setActiveCommunity] = useState<string | null>(null);

  const handleOpenPopup = (community: string) => {
    setActiveCommunity(community);
  };

  const handleClosePopup = () => {
    setActiveCommunity(null);
  };

  const communities = [
    { name: "Community 1", color: "#ff6666" },
    { name: "Community 2", color: "#66b3ff" },
    { name: "Community 3", color: "#99ff99" },
    { name: "Community 4", color: "#ffcc66" },
    { name: "Community 5", color: "#ff99ff" },
    { name: "Community 6", color: "#c27ba0" },
    { name: "Community 7", color: "#8dd3c7" },
    { name: "Community 8", color: "#bc80bd" },
    { name: "Community 9", color: "#fdb462" },
    { name: "Community 10", color: "#b3de69" },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
          Legend
        </h3>
        <hr className="border-t-2 border-blue-200" />
      </div>

      {/* Community List */}
      <ul className="space-y-2 mt-4">
        {communities.map((community, index) => (
          <li
            key={index}
            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition"
            onClick={() => handleOpenPopup(community.name)}
          >
            {/* Color Indicator */}
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: community.color }}
            ></span>
            <span className="text-gray-600">{community.name}</span>
          </li>
        ))}
      </ul>

      {/* Popup */}
      {activeCommunity && (
        <Popup
          title={activeCommunity}
          isOpen={!!activeCommunity}
          onClose={handleClosePopup}
        >
          <p className="text-gray-600">
            This is information about {activeCommunity}.
          </p>
        </Popup>
      )}
    </div>
  );
};

export default Legend;
