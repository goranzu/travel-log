import React, { useEffect, useReducer, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

async function apiClient() {
  const response = await fetch("http://localhost:5000/api/logs");
  const data = await response.json();
  if (response.ok) {
    return data;
  }

  const error = new Error("Error fetching data.");
  error.response = data;
  throw error;
}

const LOADING = "LOADING";
const RESOLVED = "RESOLVED";
const REJECTED = "REJECTED";
const IDLE = "IDLE";

const initialState = {
  data: [],
  error: "",
  status: IDLE,
};

function reducer(state, action) {
  switch (action.type) {
    case LOADING:
      return { ...initialState, status: LOADING };
    case RESOLVED:
      return { ...initialState, status: RESOLVED, data: action.payload.data };
    case REJECTED:
      return { ...initialState, status: REJECTED, error: action.payload.error };
    case IDLE:
      return { ...initialState };
    default:
      throw new Error("Error in reduce");
  }
}

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
  const [fetchState, dispatch] = useReducer(reducer, initialState);
  const [newMapLocation, setNewMapLocation] = useState(null);
  const [newMarkerLocation, setNewMarkerLocation] = useState([]);

  const offset = {
    offsetLeft: -15,
    offsetTop: -15,
  };

  useEffect(() => {
    (async function fetchLocations() {
      try {
        dispatch({ type: LOADING });
        const { data } = await apiClient();
        dispatch({ type: RESOLVED, payload: { data } });
      } catch (error) {
        dispatch({ type: REJECTED, payload: { error: error.message } });
      }
    })();
  }, []);

  function handleAddMapMarker(e) {
    const [longitude, latitude] = e.lngLat;
    setNewMapLocation({ latitude, longitude });
  }

  async function handleSubmit(e) {
    // TODO: Add visitDate
    // TODO: Maybe slide out the form from the side
    e.preventDefault();
    setNewMarkerLocation([]);
    const title = e.target.title.value;
    const { latitude, longitude } = newMapLocation;
    const response = await fetch("http://localhost:5000/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        latitude,
        longitude,
      }),
    });
    const { data } = await response.json();
    // TODO: Just refecth the locations after success
    setNewMarkerLocation([
      ...newMarkerLocation,
      [data.location.coordinates[0], data.location.coordinates[1]],
    ]);
  }

  return (
    <>
      {fetchState.status === REJECTED && <p>{fetchState.error}</p>}
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={token}
        onViewportChange={(viewport) => setViewport(viewport)}
        onDblClick={handleAddMapMarker}
        doubleClickZoom={false}
      >
        {fetchState.status === RESOLVED &&
          fetchState.data.map((l) => (
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
        {newMarkerLocation.length > 0 &&
          newMarkerLocation.map((l, i) => (
            <Marker key={i} latitude={l[0]} longitude={l[1]} {...offset}>
              <button
                className="marker-button"
                // onClick={() => setShowPopup({ ...showPopup, [l._id]: true })}
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
          ))}
      </ReactMapGL>
    </>
  );
}

export default App;
