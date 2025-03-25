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
    <div className="w-full h-full" dir="rtl">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-indigo-900">רשימת קהילות</h3>
        <p className="text-sm text-gray-500">בחר קהילה לצפייה בפרטים נוספים</p>
      </div>

      <div className="space-y-2 mt-6">
        {communities.map((community: Community, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-indigo-50 rounded-xl transition duration-200 border border-transparent hover:border-indigo-100"
            onClick={() => handleOpenPopup(community.name)}
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">
                {community.name}
              </span>
              <span
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: community.color }}
              ></span>
            </div>

            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {communities.length === 0 && (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-indigo-50 rounded-full mx-auto mb-3 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-gray-500">לא נמצאו קהילות</p>
        </div>
      )}

      {activeCommunity && (
        <Popup
          title={activeCommunity}
          isOpen={!!activeCommunity}
          onClose={handleClosePopup}
        >
          <div className="p-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                <div
                  className="w-12 h-12 rounded-full"
                  style={{
                    backgroundColor: communities.find(
                      (c) => c.name === activeCommunity
                    )?.color,
                  }}
                ></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">
              {activeCommunity}
            </h3>
            <p className="text-gray-600 text-right">
              מידע מפורט על קהילת {activeCommunity}. כאן ניתן להציג פרטים
              נוספים, סטטיסטיקות, או מידע רלוונטי אחר אודות הקהילה.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                onClick={handleClosePopup}
              >
                סגור
              </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default Legend;
