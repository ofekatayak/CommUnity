import React, { useState, useEffect, useRef } from "react";
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
  setActiveCommunity: (name: string | null) => void;
}

const defaultCenter = { lat: 31.25181, lon: 34.7913 };
const defaultZoom = 11.2;

const Map: React.FC<MapProps> = ({ communities, activeCommunity, setActiveCommunity }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [dimensions, setDimensions] = useState({ width: "100%", height: "100%" });
  const [isMapReady, setIsMapReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // קבע מידות בעת טעינה
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: `${width}px`, height: `${height}px` });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    setIsMapReady(true);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // שינוי מרכז המפה על פי קהילה נבחרת
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
    setCenter(defaultCenter);
    setZoom(defaultZoom);
    setActiveCommunity(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[550px] bg-white rounded-b-xl overflow-hidden"
      dir="rtl"
    >
      {isMapReady ? (
        <Plot
          data={[
            {
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
            },
          ]}
          layout={{
            mapbox: {
              style: "open-street-map",
              center,
              zoom,
            },
            margin: { t: 0, r: 0, b: 0, l: 0 },
            autosize: true,
            paper_bgcolor: "transparent",
          }}
          config={{
            displaylogo: false,
            displayModeBar: false,
            responsive: true,
          }}
          style={dimensions}
          useResizeHandler
          onClick={(data) => {
            const index = data.points?.[0]?.pointIndex;
            if (index !== undefined) {
              setActiveCommunity(communities[index].name);
            }
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <p className="text-indigo-800 font-medium">טוען מפה...</p>
        </div>
      )}

      {/* כפתורי שליטה בזום */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          className="w-10 h-10 bg-white rounded-lg shadow-md"
          onClick={() => setZoom((z) => Math.min(z + 1, 20))}
        >
          ➕
        </button>
        <button
          className="w-10 h-10 bg-white rounded-lg shadow-md"
          onClick={() => setZoom((z) => Math.max(z - 1, 1))}
        >
          ➖
        </button>
        <button
          className="w-10 h-10 bg-white rounded-lg shadow-md"
          onClick={resetMapView}
        >
          🔁
        </button>
      </div>
    </div>
  );
};

export default Map;
