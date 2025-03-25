import React, { useState } from "react";
import Popup from "./popups/Popup";

interface Community {
  name: string;
  color: string;
}

interface LegendProps {
  communities: Community[];
  setActiveCommunity: React.Dispatch<React.SetStateAction<string | null>>;
}

const Legend: React.FC<LegendProps> = ({ communities, setActiveCommunity }) => {
  const [activeCommunity] = useState<string | null>(null);

  const handleOpenPopup = (community: string) => {
    setActiveCommunity(community);
  };

  const handleClosePopup = () => {
    setActiveCommunity(null);
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm"
      dir="rtl"
    >
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
          מקרא קהילות
        </h3>
        <hr className="border-t-2 border-blue-200" />
      </div>

      <ul className="space-y-2 mt-4">
        {communities.map((community: Community, index: number) => (
          <li
            key={index}
            className="flex flex-row-reverse items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition text-right"
            onClick={() => handleOpenPopup(community.name)}
          >
            <span className="text-gray-600 w-full text-right">
              {community.name}
            </span>
            <span
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: community.color }}
            ></span>
          </li>
        ))}
      </ul>

      {activeCommunity && (
        <Popup
          title={activeCommunity}
          isOpen={!!activeCommunity}
          onClose={handleClosePopup}
        >
          <p className="text-gray-600 text-right">
            זו מידע על הקהילה: {activeCommunity}
          </p>
        </Popup>
      )}
    </div>
  );
};

export default Legend;
