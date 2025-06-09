// LayersPanel.tsx - Map Layers Control Panel Component with Repeating Scroll Animations
import React, { useState, useEffect, useRef } from "react";
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
  // Refs for animation tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLabelElement | null)[]>([]);

  // Animation states - start as false for initial animation
  const [containerVisible, setContainerVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [listVisible, setListVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [itemVisibility, setItemVisibility] = useState<boolean[]>([]);

  // Track which elements have been animated once
  const [hasAnimated, setHasAnimated] = useState({
    container: false,
    header: false,
    list: false,
    export: false,
    items: new Set<number>(),
  });

  // State for export menu visibility
  const [showMenu, setShowMenu] = useState(false);

  // Update item visibility array when layers change
  useEffect(() => {
    setItemVisibility(new Array(availableLayers.length).fill(false));
    itemRefs.current = new Array(availableLayers.length).fill(null);
    // Reset items animation tracking when layers change
    setHasAnimated((prev) => ({
      ...prev,
      items: new Set<number>(),
    }));
  }, [availableLayers.length]);

  // Intersection Observer setup with one-time animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "-10px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target;

        if (
          target === containerRef.current &&
          entry.isIntersecting &&
          !hasAnimated.container
        ) {
          setContainerVisible(true);
          setHasAnimated((prev) => ({ ...prev, container: true }));
        } else if (
          target === headerRef.current &&
          entry.isIntersecting &&
          !hasAnimated.header
        ) {
          setHeaderVisible(true);
          setHasAnimated((prev) => ({ ...prev, header: true }));
        } else if (
          target === listRef.current &&
          entry.isIntersecting &&
          !hasAnimated.list
        ) {
          setListVisible(true);
          setHasAnimated((prev) => ({ ...prev, list: true }));
        } else if (
          target === exportRef.current &&
          entry.isIntersecting &&
          !hasAnimated.export
        ) {
          setExportVisible(true);
          setHasAnimated((prev) => ({ ...prev, export: true }));
        }
      });
    }, observerOptions);

    // Small delay to ensure elements are rendered
    const timeoutId = setTimeout(() => {
      if (containerRef.current) observer.observe(containerRef.current);
      if (headerRef.current) observer.observe(headerRef.current);
      if (listRef.current) observer.observe(listRef.current);
      if (exportRef.current) observer.observe(exportRef.current);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [hasAnimated]);

  // Separate effect for observing layer items - one-time animations
  useEffect(() => {
    if (availableLayers.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "-10px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target;
        const itemIndex = itemRefs.current.findIndex((ref) => ref === target);
        if (
          itemIndex !== -1 &&
          entry.isIntersecting &&
          !hasAnimated.items.has(itemIndex)
        ) {
          setItemVisibility((prev) => {
            const newVisibility = [...prev];
            newVisibility[itemIndex] = true;
            return newVisibility;
          });
          setHasAnimated((prev) => ({
            ...prev,
            items: new Set([...prev.items, itemIndex]),
          }));
        }
      });
    }, observerOptions);

    // Observe layer items with a small delay to ensure they're rendered
    const timeoutId = setTimeout(() => {
      itemRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [availableLayers.length, hasAnimated.items]);

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

  // Render layer checkbox item with animation
  const renderLayerCheckbox = (layer: string, index: number) => (
    <label
      key={layer}
      ref={(el) => (itemRefs.current[index] = el)}
      className={`flex items-center gap-3 text-base font-medium text-gray-800 transform transition-all duration-600 ease-out ${
        itemVisibility[index]
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
      style={{
        transitionDelay: itemVisibility[index] ? `${index * 80}ms` : "0ms",
      }}
    >
      <input
        type="checkbox"
        checked={selectedLayers.includes(layer)}
        onChange={() => onToggleLayer(layer)}
        className={`w-4 h-4 accent-indigo-600 transform transition-all duration-600 ease-out ${
          itemVisibility[index] ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        style={{
          transitionDelay: itemVisibility[index]
            ? `${index * 80 + 150}ms`
            : "0ms",
        }}
      />
      <span
        className={`transform transition-all duration-600 ease-out ${
          itemVisibility[index]
            ? "translate-x-0 opacity-100"
            : "translate-x-3 opacity-0"
        }`}
        style={{
          transitionDelay: itemVisibility[index]
            ? `${index * 80 + 200}ms`
            : "0ms",
        }}
      >
        {layerNameMap[layer] || layer}
      </span>
    </label>
  );

  // Render export menu options with animation
  const renderExportMenu = () => (
    <div
      className={`absolute bottom-14 w-full bg-white border border-gray-300 rounded shadow-xl z-10 transform transition-all duration-400 ease-out ${
        showMenu ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <button
        onClick={handleGeoJSONExport}
        className="block w-full text-right px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition-colors duration-200"
      >
        ייצוא ל־GeoJSON
      </button>
      <button
        onClick={handleExcelExport}
        className="block w-full text-right px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition-colors duration-200"
      >
        ייצוא ל־Excel (נקודות)
      </button>
    </div>
  );

  // Render layers list section with animation
  const renderLayersList = () => (
    <div
      ref={listRef}
      className={`transform transition-all duration-800 ease-out ${
        listVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <h3
        ref={headerRef}
        className={`font-semibold text-indigo-900 mb-3 text-lg transform transition-all duration-800 ease-out ${
          headerVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-4 opacity-0"
        }`}
        style={{ transitionDelay: headerVisible ? "200ms" : "0ms" }}
      >
        שכבות מידע
      </h3>
      <div className="space-y-3">
        {availableLayers.map((layer, index) =>
          renderLayerCheckbox(layer, index)
        )}
      </div>
    </div>
  );

  // Render export section with animation
  const renderExportSection = () => (
    <div
      ref={exportRef}
      className={`relative text-right mt-6 transform transition-all duration-800 ease-out ${
        exportVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <button
        className={`bg-indigo-600 text-white w-full py-3 rounded-xl text-base font-semibold hover:bg-indigo-700 transform transition-all duration-600 ease-out ${
          exportVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{ transitionDelay: exportVisible ? "200ms" : "0ms" }}
        onClick={toggleExportMenu}
      >
        ייצוא שכבות מידע💾
      </button>
      {showMenu && renderExportMenu()}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col justify-between h-full transform transition-all duration-1000 ease-out ${
        containerVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ overflowY: "auto", overflowX: "hidden" }}
    >
      {/* Layers List Section */}
      {renderLayersList()}

      {/* Export Section */}
      {renderExportSection()}
    </div>
  );
};

export default LayersPanel;
export { exportToGeoJSON, exportToExcel, layerNameMap };
