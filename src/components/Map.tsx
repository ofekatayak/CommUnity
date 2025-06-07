// Map.tsx - Interactive Map Component with Plotly
import React, { useState, useEffect, useRef, useMemo } from "react";
import Plot from "react-plotly.js";
import { Data } from "plotly.js";

// Interface for community data structure
interface Community {
  name: string;
  lat: number;
  lon: number;
  color: string;
}

// Interface for component props
interface MapProps {
  communities: Community[];
  activeCommunity: string | null;
  setActiveCommunity: React.Dispatch<React.SetStateAction<string | null>>;
  selectedLayers: string[];
  setLayerDataMap: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

// Interface for map center coordinates
interface MapCenter {
  lat: number;
  lon: number;
}

// Interface for map dimensions
interface MapDimensions {
  width: string;
  height: string;
}

const Map: React.FC<MapProps> = ({
  communities,
  activeCommunity,
  setActiveCommunity,
  selectedLayers,
  setLayerDataMap,
}) => {
  // Default map settings
  const defaultCenter: MapCenter = { lat: 31.252973, lon: 34.791462 };
  const defaultZoom = 12;

  // State management
  const [extraTraces, setExtraTraces] = useState<Partial<Data>[]>([]);
  const [center, setCenter] = useState<MapCenter>(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [isMapReady, setIsMapReady] = useState(false);
  const [dimensions, setDimensions] = useState<MapDimensions>({
    width: "100%",
    height: "100%",
  });

  // Reference to container element
  const containerRef = useRef<HTMLDivElement>(null);

  // Map layer names in Hebrew - using useMemo to prevent re-creation on every render
  const layerNameMap: Record<string, string> = useMemo(
    () => ({
      bicycle_tracks: "מסלולי אופניים",
      business_centers: "מרכזי עסקים",
      community_centers: "מתנ״סים",
      dog_gardens: "גינות כלבים",
      education: "מוסדות חינוך",
      elderly_social_clubs: "מועדוני קשישים",
      health_clinics: "מרפאות",
      playgrounds: "גני שעשועים",
      shelters: "מקלטים",
      synagogues: "בתי כנסת",
    }),
    []
  );

  // Color mapping for different layers - using useMemo to prevent re-creation on every render
  const layerColors: Record<string, string> = useMemo(
    () => ({
      bicycle_tracks: "#3b82f6",
      business_centers: "#ef4444",
      community_centers: "#10b981",
      dog_gardens: "#8b5cf6",
      education: "#f59e0b",
      elderly_social_clubs: "#6366f1",
      health_clinics: "#ec4899",
      playgrounds: "#22c55e",
      shelters: "#14b8a6",
      synagogues: "#f97316",
    }),
    []
  );

  // Initialize map and set up dimension tracking
  useEffect(() => {
    // Set map as ready after initial render
    setIsMapReady(true);

    // Function to update container dimensions
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: `${width}px`,
          height: `${height}px`,
        });
      }
    };

    // Run once initially
    updateDimensions();

    // Set up resize listener
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Load and process selected layers
  useEffect(() => {
    const loadLayers = async () => {
      const traces: Partial<Data>[] = [];
      const updatedLayerDataMap: Record<string, any> = {};

      for (const layerName of selectedLayers) {
        try {
          const response = await fetch(`/data/${layerName}.geojson`);
          const geojson = await response.json();

          updatedLayerDataMap[layerName] = geojson;

          // Extract coordinates from GeoJSON features
          const lat = geojson.features.map(
            (feature: any) => feature.geometry.coordinates[1]
          );
          const lon = geojson.features.map(
            (feature: any) => feature.geometry.coordinates[0]
          );

          // Create trace for this layer
          traces.push({
            type: "scattermapbox",
            mode: "markers",
            name: layerNameMap[layerName] || layerName,
            lat,
            lon,
            marker: {
              size: 8,
              symbol: "circle",
              color: layerColors[layerName] || "#4b5563",
            },
            text: geojson.features.map(
              () => `🔺 ${layerNameMap[layerName] || layerName}`
            ),
            hoverinfo: "text",
            hoverlabel: {
              bgcolor: "#4f46e5",
              bordercolor: "#4f46e5",
              font: { color: "white", size: 13 },
            },
          });
        } catch (error) {
          console.error(`Error loading layer ${layerName}:`, error);
        }
      }

      setLayerDataMap(updatedLayerDataMap);
      setExtraTraces(traces);
    };

    if (selectedLayers.length > 0) {
      loadLayers();
    } else {
      setExtraTraces([]);
    }
  }, [selectedLayers, setLayerDataMap, layerNameMap, layerColors]);

  // Handle active community changes - center map on selected community
  useEffect(() => {
    if (activeCommunity) {
      const matchingCommunities = communities.filter(
        (c) => c.name === activeCommunity
      );
      if (matchingCommunities.length > 0) {
        const avgLat =
          matchingCommunities.reduce((sum, c) => sum + c.lat, 0) /
          matchingCommunities.length;
        const avgLon =
          matchingCommunities.reduce((sum, c) => sum + c.lon, 0) /
          matchingCommunities.length;
        setCenter({ lat: avgLat, lon: avgLon });
      }
    }
  }, [activeCommunity, communities]);

  // Reset map to default view
  const resetMapView = () => {
    setActiveCommunity(null);
    setCenter(defaultCenter);
    setZoom(defaultZoom);
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 1, 20));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 1, 1));
  };

  // Update dimensions after map is ready (with slight delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: `${width}px`,
          height: `${height}px`,
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isMapReady]);

  // Get selected layers for legend display
  const getSelectedLayersForLegend = () => {
    return selectedLayers.map((layerKey) => ({
      name: layerNameMap[layerKey] || layerKey,
      color: layerColors[layerKey] || "#4b5563",
    }));
  };

  // Render active layers legend
  const renderActiveLayersLegend = () => {
    const activeLayers = getSelectedLayersForLegend();

    if (activeLayers.length === 0) return null;

    return (
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md border border-gray-200 p-3 max-w-xs">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          שכבות פעילות:
        </h4>
        <div className="space-y-1">
          {activeLayers.map((layer, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: layer.color }}
              />
              <span className="text-xs text-gray-600">{layer.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Handle map click events
  const handleMapClick = (data: any) => {
    if (data.points && data.points[0]) {
      const pointIndex = data.points[0].pointIndex;
      if (typeof pointIndex === "number" && communities[pointIndex]) {
        setActiveCommunity(communities[pointIndex].name);
      }
    }
  };

  // Handle map layout changes (pan/zoom)
  const handleMapRelayout = (event: Partial<Record<string, unknown>>) => {
    if (event["mapbox.center"]) {
      const mapboxCenter = event["mapbox.center"] as MapCenter;
      setCenter(mapboxCenter);
    }
    if (event["mapbox.zoom"] !== undefined) {
      const mapboxZoom = event["mapbox.zoom"] as number;
      setZoom(mapboxZoom);
    }
  };

  // Create communities trace data
  const createCommunitiesTrace = (): Partial<Data> => ({
    type: "scattermapbox",
    lat: communities.map((c) => c.lat),
    lon: communities.map((c) => c.lon),
    text: communities.map((c) => c.name),
    mode: "markers+text" as any,
    marker: {
      size: communities.map((c) => (c.name === activeCommunity ? 18 : 14)),
      color: communities.map((c) => c.color),
      opacity: communities.map((c) => (c.name === activeCommunity ? 1 : 0.8)),
    },
    textposition: "top center",
    hoverinfo: "text",
    hoverlabel: {
      bgcolor: "#4f46e5",
      bordercolor: "#4f46e5",
      font: { color: "white", size: 14 },
    },
  });

  // Render plus icon for zoom in
  const renderPlusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-indigo-600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Render minus icon for zoom out
  const renderMinusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-indigo-600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Render home icon for reset view
  const renderHomeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-indigo-600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  );

  // Render loading indicator
  const renderLoadingIndicator = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-2" />
        <p className="text-indigo-800 font-medium">טוען מפה...</p>
      </div>
    </div>
  );

  // Render zoom control buttons
  const renderZoomControls = () => (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
      <button
        className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-indigo-50 transition-colors border border-gray-100"
        onClick={handleZoomIn}
        aria-label="Zoom in"
      >
        {renderPlusIcon()}
      </button>
      <button
        className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-indigo-50 transition-colors border border-gray-100"
        onClick={handleZoomOut}
        aria-label="Zoom out"
      >
        {renderMinusIcon()}
      </button>
      <button
        className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-indigo-50 transition-colors border border-gray-100"
        onClick={resetMapView}
        aria-label="Reset view"
      >
        {renderHomeIcon()}
      </button>
    </div>
  );

  // Custom CSS styles for map components
  const mapStyles = `
    .modebar {
      left: 10px !important;
      right: unset !important;
      transform: scale(1.05);
      transform-origin: top left;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, 0.9) !important;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
    }

    .modebar-btn {
      color: #6366f1 !important;
    }

    .modebar-btn:hover {
      background-color: #eef2ff !important;
    }

    .modebar-btn:hover .modebar-btn-text {
      right: 5px;
      display: flex;
      justify-content: center;
      width: 100%;
      color: #4f46e5 !important;
    }
    
    .main-svg {
      background-color: transparent !important;
    }
    
    .mapboxgl-ctrl-logo {
      display: none !important;
    }
  `;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[550px] bg-white rounded-b-xl overflow-hidden"
      dir="rtl"
    >
      {/* Custom CSS Styles */}
      <style>{mapStyles}</style>

      {/* Main Map Component */}
      {isMapReady && (
        <Plot
          data={[createCommunitiesTrace(), ...extraTraces]}
          layout={{
            mapbox: {
              style: "open-street-map",
              center: center,
              zoom: zoom,
              // Hide legend for community traces
            },
            margin: { t: 0, r: 0, l: 0, b: 0 },
            autosize: true,
            paper_bgcolor: "transparent",
            showlegend: false, // Hide the automatic legend completely
          }}
          config={{
            mapboxAccessToken: "YOUR_MAPBOX_ACCESS_TOKEN", // Replace if needed
            displaylogo: false,
            modeBarButtonsToRemove: ["lasso2d", "select2d", "toggleHover"],
            displayModeBar: false,
            responsive: true,
            scrollZoom: true,
          }}
          style={dimensions}
          useResizeHandler
          onRelayout={handleMapRelayout}
          onClick={handleMapClick}
        />
      )}

      {/* Loading Indicator */}
      {!isMapReady && renderLoadingIndicator()}

      {/* Active Layers Legend */}
      {renderActiveLayersLegend()}

      {/* Zoom Control Buttons */}
      {renderZoomControls()}
    </div>
  );
};

export default Map;
