import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { REJECTED, RESOLVED } from "./constants";
import useGetLocations from "./hooks/useGetLocations";
import usePostLocation from "./hooks/usePostLocation";

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
  const [postLocationState, postLocation] = usePostLocation();

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
  }

  async function handleSubmit(e) {
    // TODO: Add visitDate
    // TODO: Maybe slide out the form from the side
    e.preventDefault();
    const title = e.target.title.value;
    const { latitude, longitude } = newMapLocation;
    await postLocation({ title, latitude, longitude });
  }

  return (
    <>
      {getLocationState.status === REJECTED && <p>{getLocationState.error}</p>}
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
        {newMapLocation && (
          <Popup
            latitude={newMapLocation.latitude}
            longitude={newMapLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewMapLocation(null)}
            anchor="top"
          >
            <form onSubmit={handleSubmit}>
              <h5>New Map Location</h5>
              <label htmlFor="title">Title:</label>
              <input name="title" id="title" type="text" placeholder="title" />
              <button type="submit">Send</button>
            </form>
          </Popup>
        )}
      </ReactMapGL>
    </>
  );
}

export default App;
