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
  const defaultCenter = { lat: 31.7683, lon: 34.7818 }; // Default map center
  const defaultZoom = 7; // Default zoom level

  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);

  useEffect(() => {
    if (activeCommunity) {
      const community = communities.find((c) => c.name === activeCommunity);
      if (community) {
        setCenter({ lat: community.lat, lon: community.lon });
        setZoom(15); // Zoom level for selected community
      }
    }
  }, [activeCommunity, communities]);

  // Function to reset map to default view
  const resetMapView = () => {
    setActiveCommunity(null); // Reset active community
    setCenter(defaultCenter);
    setZoom(defaultZoom);
  };

  return (
    <div className="relative w-full h-full">
      <Plot
        data={[
          {
            type: "scattermapbox",
            lat: communities.map((c) => c.lat),
            lon: communities.map((c) => c.lon),
            text: communities.map((c) => c.name),
            mode: "markers",
            marker: {
              size: 14,
              color: communities.map((c) => c.color),
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
        }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
        config={{
          mapboxAccessToken: "YOUR_MAPBOX_ACCESS_TOKEN",
          displaylogo: false, // Disable Plotly logo
          modeBarButtonsToRemove: ["lasso2d", "select2d"],
          displayModeBar: true,
          modeBarButtons: [
            [
              {
                name: "Home",
                title: "Reset to Default View",
                icon: {
                  path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
                  transform: "scale(1.5)",
                  ascent: 1,
                  descent: 0,
                },
                click: resetMapView,
              },
              {
                name: "Zoom In",
                title: "Zoom In",
                icon: {
                  path: "M12 10h-2v2H8v2h2v2h2v-2h2v-2h-2v-2zm-2-6c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S15.52 4 10 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8-8 8z",
                  transform: "scale(1.5)",
                  ascent: 1,
                  descent: 0,
                },
                click: () => setZoom((prevZoom) => Math.min(prevZoom + 1, 20)),
              },
              {
                name: "Zoom Out",
                title: "Zoom Out",
                icon: {
                  path: "M15 11H9v2h6v-2zm-3-9c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S15.52 2 10 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8-8 8z",
                  transform: "scale(1.5)",
                  ascent: 1,
                  descent: 0,
                },
                click: () => setZoom((prevZoom) => Math.max(prevZoom - 1, 1)),
              },
            ],
          ],
        }}
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
