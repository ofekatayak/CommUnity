import React, { useEffect, useState, useRef } from "react";
import Plot from "react-plotly.js";

interface Community {
  name: string;
  lat: number;
  lon: number;
  color: string;
}

interface MapProps {
  communities: Community[];
  activeCommunity: string | null;
  setActiveCommunity: React.Dispatch<React.SetStateAction<string | null>>;
}

const Map: React.FC<MapProps> = ({
  communities,
  activeCommunity,
  setActiveCommunity,
}) => {
  const defaultCenter = { lat: 31.7683, lon: 34.7818 }; // Default map center (Israel)
  const defaultZoom = 7;

  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [isMapReady, setIsMapReady] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: "100%",
    height: "100%",
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // טעינה ראשונית של המפה והגדרת מימדים
  useEffect(() => {
    // הגדר שהמפה מוכנה לאחר רנדור ראשוני
    setIsMapReady(true);

    // מדידת מימדי המכולה ועדכון state
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: `${width}px`,
          height: `${height}px`,
        });
      }
    };

    // הרץ פעם ראשונה
    updateDimensions();

    // והגדר גם כאשר גודל החלון משתנה
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // עדכון המיקום כאשר קהילה פעילה משתנה
  useEffect(() => {
    if (activeCommunity) {
      const community = communities.find((c) => c.name === activeCommunity);
      if (community) {
        setCenter({ lat: community.lat, lon: community.lon });
        setZoom(15);
      }
    }
  }, [activeCommunity, communities]);

  const resetMapView = () => {
    setActiveCommunity(null);
    setCenter(defaultCenter);
    setZoom(defaultZoom);
  };

  // עיכוב מזערי בהצגת המפה כדי שהכל יהיה מוכן
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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[550px] bg-white rounded-b-xl overflow-hidden"
      dir="rtl"
    >
      <style>
        {`
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
        `}
      </style>

      {/* Info message */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-md border border-indigo-100 max-w-xs">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-gray-800">
            לחץ על נקודה כדי לצפות בפרטי הקהילה
          </span>
        </div>
      </div>

      {isMapReady && (
        <Plot
          data={[
            {
              type: "scattermapbox",
              lat: communities.map((c) => c.lat),
              lon: communities.map((c) => c.lon),
              text: communities.map((c) => c.name),
              mode: "markers+text" as any,
              marker: {
                size: communities.map((c) =>
                  c.name === activeCommunity ? 18 : 14
                ),
                color: communities.map((c) => c.color),
                opacity: communities.map((c) =>
                  c.name === activeCommunity ? 1 : 0.8
                ),
              },
              textposition: "top center",
              hoverinfo: "text",
              hoverlabel: {
                bgcolor: "#4f46e5",
                bordercolor: "#4f46e5",
                font: { color: "white", size: 14 },
              },
            },
          ]}
          layout={{
            mapbox: {
              style: "open-street-map",
              center: center,
              zoom: zoom,
            },
            margin: { t: 0, r: 0, l: 0, b: 0 },
            autosize: true,
            paper_bgcolor: "transparent",
          }}
          config={{
            mapboxAccessToken: "YOUR_MAPBOX_ACCESS_TOKEN", // Replace if needed
            displaylogo: false,
            modeBarButtonsToRemove: ["lasso2d", "select2d", "toggleHover"],
            displayModeBar: false,
            responsive: true,
          }}
          style={dimensions}
          useResizeHandler
          onRelayout={(event: Partial<Record<string, unknown>>) => {
            if (event["mapbox.center"]) {
              const mapboxCenter = event["mapbox.center"] as {
                lat: number;
                lon: number;
              };
              setCenter(mapboxCenter);
            }
            if (event["mapbox.zoom"] !== undefined) {
              const mapboxZoom = event["mapbox.zoom"] as number;
              setZoom(mapboxZoom);
            }
          }}
          onClick={(data) => {
            if (data.points && data.points[0]) {
              const pointIndex = data.points[0].pointIndex;
              if (typeof pointIndex === "number" && communities[pointIndex]) {
                setActiveCommunity(communities[pointIndex].name);
              }
            }
          }}
        />
      )}

      {/* בזמן טעינה, הצגת אינדיקטור טעינה */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-indigo-800 font-medium">טוען מפה...</p>
          </div>
        </div>
      )}

      {/* Zoom controls - Alternative to modebar */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-indigo-50 transition-colors border border-gray-100"
          onClick={() => setZoom((prevZoom) => Math.min(prevZoom + 1, 20))}
        >
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
        </button>
        <button
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-indigo-50 transition-colors border border-gray-100"
          onClick={() => setZoom((prevZoom) => Math.max(prevZoom - 1, 1))}
        >
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
        </button>
        <button
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-indigo-50 transition-colors border border-gray-100"
          onClick={resetMapView}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Map;
