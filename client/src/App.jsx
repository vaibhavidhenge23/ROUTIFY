import { useState } from "react";
import Map from "./components/Map";
import SearchBar from "./components/SearchBar";
import RouteCards from "./components/RouteCards";
import "./App.css";

function App() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="app">
      <div className="sidebar">
        <h1 className="logo">🗺️ Routify</h1>
        <SearchBar
          setRoutes={setRoutes}
          setStartCoords={setStartCoords}
          setEndCoords={setEndCoords}
          setLoading={setLoading}
          setSelectedRoute={setSelectedRoute}
        />
        <RouteCards
          routes={routes}
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          loading={loading}
        />
      </div>
      <div className="map-container">
        <Map
          routes={routes}
          selectedRoute={selectedRoute}
          startCoords={startCoords}
          endCoords={endCoords}
        />
      </div>
    </div>
  );
}

export default App;
