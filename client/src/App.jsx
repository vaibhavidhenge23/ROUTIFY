import { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import RouteCards from "./components/RouteCards";
import SearchBar from "./components/SearchBar";

function App() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tripMode, setTripMode] = useState("city");
  const [modePopup, setModePopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [activePois, setActivePois] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);

  const handleModeChange = (mode) => {
    setTripMode(mode);
    setPopupMsg(mode === "city" ? "🏙️ City Mode Activated!" : "🛣️ Long Trip Mode Activated!");
    setModePopup(true);
    setTimeout(() => setModePopup(false), 2000);
  };

  return (
    <div className="app">

      {/* Popup - app ke andar, sidebar ke bahar */}
      {modePopup && (
        <div className="mode-popup">
          {popupMsg}
        </div>
      )}

      <div className={`sidebar ${tripMode === "long" ? "long-trip" : ""}`}>
        <h1 className="logo">🗺️ Routify</h1>

        <div className="mode-toggle">
          <button
            className={`mode-btn ${tripMode === "city" ? "active" : ""}`}
            onClick={() => handleModeChange("city")}
          >
            🏙️ City
          </button>
          <button
            className={`mode-btn ${tripMode === "long" ? "active" : ""}`}
            onClick={() => handleModeChange("long")}
          >
            🛣️ Long Trip
          </button>
        </div>

        <SearchBar
          setRoutes={setRoutes}
          setStartCoords={setStartCoords}
          setEndCoords={setEndCoords}
          setLoading={setLoading}
          setSelectedRoute={setSelectedRoute}
          tripMode={tripMode}
        />

        <RouteCards
          routes={routes}
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          loading={loading}
          tripMode={tripMode}
          activePois={activePois}
          setActivePois={setActivePois}
        />
      </div>

      <div className="map-container">
        <Map
          routes={routes}
          selectedRoute={selectedRoute}
          startCoords={startCoords}
          endCoords={endCoords}
          activePois={activePois}
          tripMode={tripMode}
          routeCoords={routeCoords}
          setRouteCoords={setRouteCoords}
        />
      </div>

    </div>
  );
}

export default App;