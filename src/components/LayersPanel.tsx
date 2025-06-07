import React, { useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

interface LayersPanelProps {
  availableLayers: string[];
  selectedLayers: string[];
  onToggleLayer: (layer: string) => void;
  layerDataMap: Record<string, any>;
}

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
  synagogues: "בתי כנסת"
};

const exportToGeoJSON = (layerDataMap: Record<string, any>) => {
  const allFeatures = Object.entries(layerDataMap).flatMap(([layer, data]) =>
    data?.features?.map((f: any) => {
      return {
        ...f,
        properties: {
          ...f.properties,
          layerName: layerNameMap[layer] || layer,
        },
      };
    }) || []
  );

  const geojson = {
    type: "FeatureCollection",
    features: allFeatures,
  };

  const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
  saveAs(blob, "all_layers.geojson");
};

const exportToExcel = (
  layerDataMap: Record<string, any>,
  selectedLayers: string[]
) => {
  const rows: any[] = [];

  selectedLayers.forEach((layerName) => {
    const geojson = layerDataMap[layerName];
    if (!geojson?.features?.length) return;

    geojson.features.forEach((f: any) => {
      const props = f.properties || {};
      const name = props.name || "ללא שם";
      const geometry = f.geometry;

      let lon: number = NaN;
      let lat: number = NaN;

      if (geometry && Array.isArray(geometry.coordinates)) {
        if (geometry.type === "Point") {
          [lon, lat] = geometry.coordinates;
        } else if (geometry.type === "Polygon") {
          const coords = geometry.coordinates?.[0];
          if (Array.isArray(coords) && coords.length > 0) {
            const centerIdx = Math.floor(coords.length / 2);
            [lon, lat] = coords[centerIdx];
          }
        } else if (geometry.type === "LineString") {
          const coords = geometry.coordinates;
          if (Array.isArray(coords) && coords.length > 0) {
            const centerIdx = Math.floor(coords.length / 2);
            [lon, lat] = coords[centerIdx];
          }
        }
      }

      if (
        typeof lon === "number" &&
        typeof lat === "number" &&
        !isNaN(lon) &&
        !isNaN(lat)
      ) {
        rows.push({
          "שכבת מידע": layerNameMap[layerName] || layerName,
          "שם המקום": name,
          "קו אורך": lon,
          "קו רוחב": lat,
        });
      }
    });
  });

  if (rows.length === 0) {
    alert("לא נמצאו נקודות בשכבות שנבחרו.");
    return;
  }

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
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h3 className="font-semibold text-indigo-900 mb-3 text-lg">שכבות מידע</h3>
        <div className="space-y-3">
          {availableLayers.map((layer) => (
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
          ))}
        </div>
      </div>

      <div className="relative text-right mt-6">
        <button
          className="bg-indigo-600 text-white w-full py-3 rounded-xl text-base font-semibold hover:bg-indigo-700"
          onClick={() => setShowMenu(!showMenu)}
        >
          Export Files 💾
        </button>
        {showMenu && (
          <div className="absolute bottom-14 w-full bg-white border border-gray-300 rounded shadow-xl z-10">
            <button
              onClick={() => exportToGeoJSON(layerDataMap)}
              className="block w-full text-right px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
            >
              ייצוא ל־GeoJSON
            </button>
            <button
              onClick={() => exportToExcel(layerDataMap, selectedLayers)}
              className="block w-full text-right px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
            >
              ייצוא ל־Excel (נקודות)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;
export { exportToGeoJSON, exportToExcel, layerNameMap };
