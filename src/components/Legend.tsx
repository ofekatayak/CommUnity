import React from "react";
import "./css/Legend.css";

const Legend: React.FC = () => {
  const communities = [
    { name: "Community 1", color: "red" },
    { name: "Community 2", color: "blue" },
    { name: "Community 3", color: "green" },
    { name: "Community 4", color: "orange" },
    { name: "Community 5", color: "purple" },
  ];

  return (
    <div className="legend">
      <h3 className="legend-title">Legend</h3>
      <ul className="legend-list">
        {communities.map((community, index) => (
          <li key={index} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: community.color }}
            ></div>
            {community.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
