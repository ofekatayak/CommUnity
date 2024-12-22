import React, { useState } from "react";
import Popup from "./popups/Popup";
import "./css/Legend.css";

const Legend: React.FC = () => {
  // State to manage the currently active community for displaying in the popup
  const [activeCommunity, setActiveCommunity] = useState<string | null>(null);

  // Function to open the popup for a specific community
  const handleOpenPopup = (community: string) => {
    setActiveCommunity(community);
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setActiveCommunity(null);
  };

  // List of communities with their names and corresponding colors
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
    <div className="legend-container">
      {/* Title for the Legend section */}
      <h3 className="legend-title">Legend</h3>

      {/* List of communities */}
      <ul className="legend-list">
        {communities.map((community, index) => (
          <li
            key={index}
            className="legend-item"
            onClick={() => handleOpenPopup(community.name)}
          >
            {/* Color indicator for each community */}
            <span
              className="legend-color"
              style={{ backgroundColor: community.color }}
            ></span>
            {community.name}
          </li>
        ))}
      </ul>

      {/* Popup to display information about the selected community */}
      {activeCommunity && (
        <Popup
          title={activeCommunity}
          isOpen={!!activeCommunity}
          onClose={handleClosePopup}
        >
          <p>This is information about {activeCommunity}.</p>
        </Popup>
      )}
    </div>
  );
};

export default Legend;
