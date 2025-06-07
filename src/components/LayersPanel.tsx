// LayersPanel.tsx - Map Layers Control Panel Component
import React, { useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// Interface for component props
interface LayersPanelProps {
  availableLayers: string[];
  selectedLayers: string[];
  onToggleLayer: (layer: string) => void;
  layerDataMap: Record<string, any>;
}

// Interface for geometry coordinates
interface GeometryCoordinates {
  lon: number;
  lat: number;
}

// Interface for Excel export row
interface ExcelRow {
  "שכבת מידע": string;
  "שם המקום": string;
  "קו אורך": number;
  "קו רוחב": number;
}

// Map layer names from English keys to Hebrew display names
const layerNameMap: Record<string, string> = {
  bicycle_tracks: "מסלולי אופניים",
  business_centers: "מרכזי עסקים",
  community_centers: "מתנ" + String.fromCharCode(8220) + "סים",
  dog_gardens: "גינות כלבים",
  education: "מוסדות חינוך",
  elderly_social_clubs: "מועדוני קשישים",
  health_clinics: "מרפאות",
  playgrounds: "גני שעשועים",
  shelters: "מקלטים",
  synagogues: "בתי כנסת",
};

// Extract coordinates from different geometry types
const extractCoordinatesFromGeometry = (
  geometry: any
): GeometryCoordinates | null => {
  if (!geometry || !Array.isArray(geometry.coordinates)) {
    return null;
  }

  let lon: number = NaN;
  let lat: number = NaN;

  switch (geometry.type) {
    case "Point":
      [lon, lat] = geometry.coordinates;
      break;

    case "Polygon":
      const polygonCoords = geometry.coordinates?.[0];
      if (Array.isArray(polygonCoords) && polygonCoords.length > 0) {
        const centerIdx = Math.floor(polygonCoords.length / 2);
        [lon, lat] = polygonCoords[centerIdx];
      }
      break;

    case "LineString":
      const lineCoords = geometry.coordinates;
      if (Array.isArray(lineCoords) && lineCoords.length > 0) {
        const centerIdx = Math.floor(lineCoords.length / 2);
        [lon, lat] = lineCoords[centerIdx];
      }
      break;

    default:
      return null;
  }

  // Validate coordinates
  if (
    typeof lon === "number" &&
    typeof lat === "number" &&
    !isNaN(lon) &&
    !isNaN(lat)
  ) {
    return { lon, lat };
  }

  return null;
};

// Export all layer data to GeoJSON format
const exportToGeoJSON = (layerDataMap: Record<string, any>) => {
  const allFeatures = Object.entries(layerDataMap).flatMap(
    ([layer, data]) =>
      data?.features?.map((feature: any) => {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            layerName: layerNameMap[layer] || layer,
          },
        };
      }) || []
  );

  const geojson = {
    type: "FeatureCollection",
    features: allFeatures,
  };

  const blob = new Blob([JSON.stringify(geojson, null, 2)], {
    type: "application/json",
  });
  saveAs(blob, "all_layers.geojson");
};

// Export selected layers to Excel format with coordinate points
const exportToExcel = (
  layerDataMap: Record<string, any>,
  selectedLayers: string[]
) => {
  const rows: ExcelRow[] = [];

  selectedLayers.forEach((layerName) => {
    const geojson = layerDataMap[layerName];
    if (!geojson?.features?.length) return;

    geojson.features.forEach((feature: any) => {
      const properties = feature.properties || {};
      const name = properties.name || "ללא שם";
      const coordinates = extractCoordinatesFromGeometry(feature.geometry);

      if (coordinates) {
        rows.push({
          "שכבת מידע": layerNameMap[layerName] || layerName,
          "שם המקום": name,
          "קו אורך": coordinates.lon,
          "קו רוחב": coordinates.lat,
        });
      }
    });
  });

  if (rows.length === 0) {
    alert("לא נמצאו נקודות בשכבות שנבחרו.");
    return;
  }

  // Create Excel workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "נקודות בשכבות");
  XLSX.writeFile(workbook, "layers_points.xlsx");
};

const LayersPanel: React.FC<LayersPanelProps> = ({
  availableLayers,
  selectedLayers,
  onToggleLayer,
  layerDataMap,
}) => {
  // State for export menu visibility
  const [showMenu, setShowMenu] = useState(false);

  // Handle export menu toggle
  const toggleExportMenu = () => {
    setShowMenu(!showMenu);
  };

  // Handle GeoJSON export
  const handleGeoJSONExport = () => {
    exportToGeoJSON(layerDataMap);
    setShowMenu(false);
  };

  // Handle Excel export
  const handleExcelExport = () => {
    exportToExcel(layerDataMap, selectedLayers);
    setShowMenu(false);
  };

  // Render layer checkbox item
  const renderLayerCheckbox = (layer: string) => (
    <label
      key={layer}
      className="flex items-center gap-3 text-base font-medium text-gray-800"
    >
      <input
        type="checkbox"
        checked={selectedLayers.includes(layer)}
        onChange={() => onToggleLayer(layer)}
        className="w-4 h-4 accent-indigo-600"
      />
      <span>{layerNameMap[layer] || layer}</span>
    </label>
  );

  // Render export menu options
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
        ייצוא ל־Excel (נקודות)
      </button>
    </div>
  );

  // Render layers list section
  const renderLayersList = () => (
    <div>
      <h3 className="font-semibold text-indigo-900 mb-3 text-lg">שכבות מידע</h3>
      <div className="space-y-3">
        {availableLayers.map(renderLayerCheckbox)}
      </div>
    </div>
  );

  // Render export section
  const renderExportSection = () => (
    <div className="relative text-right mt-6">
      <button
        className="bg-indigo-600 text-white w-full py-3 rounded-xl text-base font-semibold hover:bg-indigo-700"
        onClick={toggleExportMenu}
      >
        Export Files 💾
      </button>
      {showMenu && renderExportMenu()}
    </div>
  );

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Layers List Section */}
      {renderLayersList()}

      {/* Export Section */}
      {renderExportSection()}
    </div>
  );
};

export default LayersPanel;
export { exportToGeoJSON, exportToExcel, layerNameMap };
