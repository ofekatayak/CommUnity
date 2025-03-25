import React, { useEffect, useState } from "react";
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

  return (
    <div className="relative w-full h-full" dir="rtl">
      <style>
        {`
    .modebar {
      left: 10px !important;
      right: unset !important;
      transform: scale(1.05);
      transform-origin: top left;
      border-radius: 8px;
    }

    .modebar-btn:hover .modebar-btn-text {
    right: 5px;
      display: flex;
      justify-content: center;
      width: 100%;
    }
  `}
      </style>

      <Plot
        data={[
          {
            type: "scattermapbox",
            lat: communities.map((c) => c.lat),
            lon: communities.map((c) => c.lon),
            text: communities.map((c) => c.name),
            mode: "markers+text" as any,
            marker: {
              size: 14,
              color: communities.map((c) => c.color),
            },
            textposition: "top center",
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
        }}
        config={{
          mapboxAccessToken: "YOUR_MAPBOX_ACCESS_TOKEN", // Replace if needed
          displaylogo: false,
          modeBarButtonsToRemove: ["lasso2d", "select2d"],
          displayModeBar: true,
          modeBarButtons: [
            [
              {
                name: "Home",
                title: "",
                icon: {
                  path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
                  transform: "scale(0.75)",
                  ascent: 1,
                  descent: 0,
                },
                click: resetMapView,
              },
              {
                name: "Zoom In",
                title: "",
                icon: {
                  path: "M12 4v8h8v2h-8v8h-2v-8H4v-2h6V4h2z",
                  transform: "scale(0.7)",
                  ascent: 1,
                  descent: 0,
                },
                click: () => setZoom((prevZoom) => Math.min(prevZoom + 1, 20)),
              },
              {
                name: "Zoom Out",
                title: "",
                icon: {
                  path: "M19 13H5v-2h14v2z",
                  transform: "scale(0.7)",
                  ascent: 1,
                  descent: 0,
                },
                click: () => setZoom((prevZoom) => Math.max(prevZoom - 1, 1)),
              },
            ],
          ],
        }}
        style={{ width: "100%", height: "100%" }}
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
      />
    </div>
  );
};

export default Map;
