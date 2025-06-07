// Legend.tsx - Community Legend and Data Display Component
import React, { useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Popup from "./popups/Popup";
import { communityData } from "../data/civilians data/CommunityData";

// Interface for community data structure
interface Community {
  name: string;
  color: string;
  lat?: number;
  lon?: number;
}

// Interface for component props
interface LegendProps {
  communities: Community[];
  onToggleCommunity: (communityName: string) => void;
  selectedCommunities?: string[];
  onToggleVisibility?: (communityName: string) => void;
  allCommunityData?: any[];
  isUserLoggedIn?: boolean;
}

// Interface for Excel export row structure
interface ExcelExportRow {
  "שם הקהילה": string;
  קטגוריה: string;
  גודל: string;
  דמוגרפיה: string;
  מאפיינים: string;
  משאבים: string;
  אתגרים: string;
  "קו רוחב": number;
  "קו אורך": number;
  צבע: string;
}

const Legend: React.FC<LegendProps> = ({
  communities,
  onToggleCommunity,
  selectedCommunities = [],
  onToggleVisibility,
  allCommunityData = [],
  isUserLoggedIn = false,
}) => {
  // State management for popup and export menu
  const [activeCommunity, setLocalActiveCommunity] = useState<string | null>(
    null
  );
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Handle opening community details popup
  const handleOpenPopup = (community: string) => {
    setLocalActiveCommunity(community);
  };

  // Handle closing community details popup
  const handleClosePopup = () => {
    setLocalActiveCommunity(null);
  };

  // Handle checkbox state change for community visibility
  const handleCheckboxChange = (
    communityName: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    if (onToggleVisibility) {
      onToggleVisibility(communityName);
    }
  };

  // Find complete community data by name
  const findFullCommunityData = (communityName: string) => {
    return allCommunityData.find((c) => c.name === communityName);
  };

  // Get community data from the imported community data object
  const getCommunityStaticData = (communityName: string) => {
    return communityData[communityName as keyof typeof communityData] || {};
  };

  // Export visible communities data to GeoJSON format
  const exportToGeoJSON = () => {
    const visibleCommunities = allCommunityData.filter((community) =>
      selectedCommunities.includes(community.name)
    );

    const features = visibleCommunities.map((community) => {
      const data = getCommunityStaticData(community.name);

      return {
        type: "Feature",
        properties: {
          name: community.name,
          color: community.color,
          category: data.category || "קהילה",
          size: data.size || "לא צוין",
          demographics: data.demographics || "לא צוין",
          characteristics: data.characteristics || [],
          resources: data.resources || [],
          challenges: data.challenges || [],
        },
        geometry: {
          type: "Point",
          coordinates: [community.lon, community.lat],
        },
      };
    });

    const geojson = {
      type: "FeatureCollection",
      features: features,
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "communities_full_data.geojson");
  };

  // Export visible communities data to Excel format
  const exportToExcel = () => {
    const visibleCommunities = allCommunityData.filter((community) =>
      selectedCommunities.includes(community.name)
    );

    if (visibleCommunities.length === 0) {
      alert("לא נבחרו קהילות לייצוא.");
      return;
    }

    const rows: ExcelExportRow[] = visibleCommunities.map((community) => {
      const data = getCommunityStaticData(community.name);

      return {
        "שם הקהילה": community.name,
        קטגוריה: data.category || "לא צוין",
        גודל: data.size || "לא צוין",
        דמוגרפיה: data.demographics || "לא צוין",
        מאפיינים: data.characteristics
          ? data.characteristics.join(", ")
          : "לא צוין",
        משאבים: data.resources ? data.resources.join(", ") : "לא צוין",
        אתגרים: data.challenges ? data.challenges.join(", ") : "לא צוין",
        "קו רוחב": community.lat,
        "קו אורך": community.lon,
        צבע: community.color,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "קהילות מלא");
    XLSX.writeFile(workbook, "communities_full_data.xlsx");
  };

  // Handle export menu actions
  const handleGeoJSONExport = () => {
    exportToGeoJSON();
    setShowExportMenu(false);
  };

  const handleExcelExport = () => {
    exportToExcel();
    setShowExportMenu(false);
  };

  // Render chevron icon for community items
  const renderChevronIcon = () => (
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
  );

  // Render warning icon for empty state
  const renderWarningIcon = () => (
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
  );

  // Render location icon for coordinates display
  const renderLocationIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-indigo-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  // Render individual community item
  const renderCommunityItem = (community: Community, index: number) => (
    <div
      key={index}
      className="flex items-center justify-between p-3 cursor-pointer hover:bg-indigo-50 rounded-xl transition duration-200 border border-transparent hover:border-indigo-100"
      onClick={() => handleOpenPopup(community.name)}
    >
      <div className="flex items-center gap-3">
        {onToggleVisibility && (
          <input
            type="checkbox"
            checked={selectedCommunities.includes(community.name)}
            onChange={(e) => handleCheckboxChange(community.name, e as any)}
            onClick={(e) => handleCheckboxChange(community.name, e)}
            className="w-4 h-4 accent-indigo-600"
          />
        )}
        <span className="text-gray-700 font-medium">{community.name}</span>
        <span
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: community.color }}
        />
      </div>
      <div className="flex items-center">{renderChevronIcon()}</div>
    </div>
  );

  // Render empty state when no communities are available
  const renderEmptyState = () => (
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-indigo-50 rounded-full mx-auto mb-3 flex items-center justify-center">
        {renderWarningIcon()}
      </div>
      <p className="text-gray-500">לא נמצאו קהילות</p>
    </div>
  );

  // Render export menu dropdown
  const renderExportMenu = () => (
    <div className="absolute bottom-14 w-full bg-white border border-gray-300 rounded shadow-xl z-10">
      <button
        onClick={handleGeoJSONExport}
        className="block w-full text-right px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
      >
        ייצוא ל־GeoJSON
      </button>
      <button
        onClick={handleExcelExport}
        className="block w-full text-right px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
      >
        ייצוא ל־Excel
      </button>
    </div>
  );

  // Render export section (only for logged-in users)
  const renderExportSection = () =>
    isUserLoggedIn && (
      <div className="relative text-right mt-6">
        <button
          className="bg-indigo-600 text-white w-full py-3 rounded-xl text-base font-semibold hover:bg-indigo-700"
          onClick={() => setShowExportMenu(!showExportMenu)}
        >
          Export Communities 📊
        </button>
        {showExportMenu && renderExportMenu()}
      </div>
    );

  // Render community header information
  const renderCommunityHeader = (fullCommunity: any, data: any) => (
    <div className="bg-indigo-50 p-4 rounded-lg">
      <div className="flex items-center gap-4 mb-3">
        <div
          className="w-12 h-12 rounded-full"
          style={{ backgroundColor: fullCommunity.color }}
        />
        <div>
          <h3 className="text-lg font-bold text-indigo-900">
            {fullCommunity.name}
          </h3>
          {data && (
            <div className="text-sm text-indigo-700 flex gap-2 items-center">
              <span className="px-2 py-0.5 rounded-full bg-indigo-100">
                {data.category}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100">
                {data.size}
              </span>
            </div>
          )}
        </div>
      </div>
      {data && (
        <div className="text-gray-700 mt-2">
          <div className="font-medium text-sm text-indigo-800">
            אוכלוסייה עיקרית:
          </div>
          <div>{data.demographics}</div>
        </div>
      )}
    </div>
  );

  // Render characteristics section
  const renderCharacteristics = (characteristics: string[]) => (
    <div>
      <h3 className="text-md font-semibold text-indigo-900 mb-2">
        מאפיינים עיקריים
      </h3>
      <ul className="bg-white rounded-lg border border-gray-100 shadow-sm p-2 mb-4">
        {characteristics.map((characteristic, index) => (
          <li
            key={index}
            className="py-2 px-3 border-b last:border-b-0 border-gray-100 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
            <span>{characteristic}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  // Render resources and challenges section
  const renderResourcesAndChallenges = (
    resources: string[],
    challenges: string[]
  ) => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-md font-semibold text-indigo-900 mb-2">משאבים</h3>
        <ul className="bg-white rounded-lg border border-gray-100 shadow-sm p-2">
          {resources.map((resource, index) => (
            <li
              key={index}
              className="py-2 px-3 border-b last:border-b-0 border-gray-100 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              <span>{resource}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-md font-semibold text-indigo-900 mb-2">אתגרים</h3>
        <ul className="bg-white rounded-lg border border-gray-100 shadow-sm p-2">
          {challenges.map((challenge, index) => (
            <li
              key={index}
              className="py-2 px-3 border-b last:border-b-0 border-gray-100 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span>{challenge}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Render location information
  const renderLocationInfo = (fullCommunity: any) => (
    <div>
      <h3 className="text-md font-semibold text-indigo-900 mb-2">מיקום</h3>
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-full">
          {renderLocationIcon()}
        </div>
        <div>
          <div className="font-medium">קואורדינטות</div>
          <div className="text-sm text-gray-500">
            {fullCommunity.lat.toFixed(4)}, {fullCommunity.lon.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );

  // Render complete popup content for community details
  const renderPopupContent = () => {
    if (!activeCommunity) return null;

    const fullCommunity = findFullCommunityData(activeCommunity);
    const data = getCommunityStaticData(activeCommunity);

    if (!fullCommunity) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500">לא נמצא מידע על הקהילה</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Community Header */}
        {renderCommunityHeader(fullCommunity, data)}

        {/* Characteristics */}
        {data && renderCharacteristics(data.characteristics)}

        {/* Resources and Challenges */}
        {data && renderResourcesAndChallenges(data.resources, data.challenges)}

        {/* Location Information */}
        {renderLocationInfo(fullCommunity)}
      </div>
    );
  };

  return (
    <div className="w-full h-full" dir="rtl">
      <div className="flex flex-col justify-between h-full">
        <div>
          {/* Header Section */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-indigo-900">
              רשימת קהילות
            </h3>
            <p className="text-sm text-gray-500">
              בחר קהילה לצפייה בפרטים נוספים
            </p>
          </div>

          {/* Communities List */}
          <div className="space-y-2 mt-6">
            {communities.length > 0
              ? communities.map(renderCommunityItem)
              : renderEmptyState()}
          </div>
        </div>

        {/* Export Section */}
        {renderExportSection()}
      </div>

      {/* Community Details Popup */}
      {activeCommunity && (
        <Popup
          title={activeCommunity}
          isOpen={!!activeCommunity}
          onClose={handleClosePopup}
        >
          <div className="p-4">
            {renderPopupContent()}
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
