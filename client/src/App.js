import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const [viewport, setViewport] = useState({
    latitude: 52.370216,
    longitude: -4.895168,
    zoom: 3,
    width: "100vw",
    height: "100vh",
  });
  const [mapLocations, setMaplocations] = useState([]);
  const token = process.env.REACT_APP_MAPBOX_KEY;

  const offset = {
    offsetLeft: -15,
    offsetTop: -15,
  };

  useEffect(() => {
    (async function fetchLocations() {
      const response = await fetch("http://localhost:5000/api/logs");
      const { data } = await response.json();
      setMaplocations(data);
    })();
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={token}
      onViewportChange={(viewport) => setViewport(viewport)}
    >
      {mapLocations.length > 0 &&
        mapLocations.map((l) => (
          <Marker
            key={l._id}
            latitude={l.location.coordinates[0]}
            longitude={l.location.coordinates[1]}
            {...offset}
          >
            <div>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <small style={{ fontWeight: "bold", color: "red" }}>
                {l.title}
              </small>
            </div>
          </Marker>
        ))}
    </ReactMapGL>
  );
}

export default App;
