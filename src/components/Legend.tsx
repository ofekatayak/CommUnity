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
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
          Legend
        </h3>
        <hr className="border-t-2 border-blue-200" />
      </div>

      <ul className="space-y-2 mt-4">
        {communities.map((community: Community, index: number) => (
          <li
            key={index}
            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition"
            onClick={() => handleOpenPopup(community.name)}
          >
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: community.color }}
            ></span>
            <span className="text-gray-600">{community.name}</span>
          </li>
        ))}
      </ul>

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
