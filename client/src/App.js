import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup, FlyToInterpolator } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { REJECTED, RESOLVED } from "./constants";
import useGetLocations from "./hooks/useGetLocations";
import usePostLocation from "./hooks/usePostLocation";
import Sidebar from "./components/Sidebar";

function App() {
  const [viewport, setViewport] = useState({
    latitude: 52.370216,
    longitude: -4.895168,
    zoom: 3,
    width: "100vw",
    height: "100vh",
  });
  const [showPopup, setShowPopup] = useState({});
  const token = process.env.REACT_APP_MAPBOX_KEY;
  const [newMapLocation, setNewMapLocation] = useState(null);
  const [getLocationState, getLocations] = useGetLocations();
  const [
    postLocationState,
    postLocation,
    resetPostLocationState,
  ] = usePostLocation();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [validationError, setValidationError] = useState("");

  const offset = {
    offsetLeft: -15,
    offsetTop: -15,
  };

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  useEffect(() => {
    if (postLocationState.status === RESOLVED) {
      getLocations();
    }
  }, [postLocationState.status, getLocations]);

  function handleAddMapMarker(e) {
    const [longitude, latitude] = e.lngLat;
    setNewMapLocation({ latitude, longitude });
    setOpenSidebar(true);
    setViewport({
      ...viewport,
      latitude,
      longitude,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }

  async function handleSubmit({ title, visitDate }) {
    const { latitude, longitude } = newMapLocation;
    if (title.length === 0 || visitDate.length === 0) {
      setValidationError("Please complete the form.");
      return;
    }
    await postLocation({ title, latitude, longitude, visitDate });
    setValidationError("");
  }

  function handleSidebarClose() {
    resetPostLocationState();
    setValidationError("");
    setOpenSidebar(false);
  }

  return (
    <>
      {getLocationState.status === REJECTED && <p>{getLocationState.error}</p>}
      <Sidebar
        openSidebar={openSidebar}
        handleSubmit={handleSubmit}
        error={postLocationState.error}
        handleSidebarClose={handleSidebarClose}
        validationError={validationError}
      />
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={token}
        onViewportChange={(viewport) => setViewport(viewport)}
        onDblClick={handleAddMapMarker}
        doubleClickZoom={false}
      >
        {getLocationState.status === RESOLVED &&
          getLocationState.data.map((l) => (
            <React.Fragment key={l._id}>
              <Marker
                latitude={l.location.coordinates[0]}
                longitude={l.location.coordinates[1]}
                {...offset}
              >
                <button
                  className="marker-button"
                  onClick={() => setShowPopup({ ...showPopup, [l._id]: true })}
                >
                  <span className="sr-only">Show tooltip</span>
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="map-marker"
                    onClick={() => setShowPopup(true)}
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </button>
              </Marker>
              {showPopup[l._id] && (
                <Popup
                  latitude={l.location.coordinates[0]}
                  longitude={l.location.coordinates[1]}
                  closeButton={true}
                  closeOnClick={true}
                  onClose={() => setShowPopup({ ...showPopup, [l._id]: false })}
                  anchor="top"
                >
                  <small style={{ fontWeight: "bold", color: "red" }}>
                    {l.title}
                  </small>
                </Popup>
              )}
            </React.Fragment>
          ))}
      </ReactMapGL>
    </>
  );
}

export default App;
