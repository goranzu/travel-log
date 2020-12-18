import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

function App() {
  const [mapLocation, setMapLocation] = useState({
    lng: 5,
    lat: 34,
    zoom: 2,
  });
  const token = process.env.REACT_APP_MAPBOX_KEY;
  mapboxgl.accessToken = token;
  const mapContainerRef = useRef(document.createElement("div"));

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [mapLocation.lng, mapLocation.lat],
      zoom: mapLocation.zoom,
    });

    map.on("move", function onMapMove() {
      setMapLocation({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div>
      <div>
        <div className="info">
          Longitude: {mapLocation.lng} &mdash; Latitude: {mapLocation.lat}{" "}
          &mdash; Zoom: {mapLocation.zoom}
        </div>
      </div>
      <div ref={mapContainerRef} className="mapContainer"></div>
    </div>
  );
}

export default App;
