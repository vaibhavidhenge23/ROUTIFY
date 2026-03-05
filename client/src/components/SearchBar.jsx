import axios from "axios";
import { useState } from "react";

function SearchBar({ setRoutes, setStartCoords, setEndCoords, setLoading, setSelectedRoute }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [vehicle, setVehicle] = useState("car");

  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(
        `https://photon.komoot.io/api/?q=${query}&limit=8&lang=en&lat=21.1458&lon=79.0882`
      );
      // India ke results filter karo
      const indiaResults = res.data.features.filter(
        (place) => place.properties.country === "India"
      );
      setSuggestions(indiaResults.length > 0 ? indiaResults : res.data.features);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleStartChange = (e) => {
    setStart(e.target.value);
    setSelectedStart(null);
    fetchSuggestions(e.target.value, setStartSuggestions);
  };

  const handleEndChange = (e) => {
    setEnd(e.target.value);
    setSelectedEnd(null);
    fetchSuggestions(e.target.value, setEndSuggestions);
  };

  const getPlaceIcon = (place) => {
    const type = place.properties.type || "";
    if (type === "city" || type === "town") return "🏙️";
    if (type === "village") return "🏘️";
    if (type === "restaurant") return "🍽️";
    if (type === "hospital") return "🏥";
    if (type === "fuel") return "⛽";
    if (type === "hotel") return "🏨";
    return "📍";
  };

  const getPlaceName = (place) => {
    const name = place.properties.name || "";
    const city = place.properties.city || place.properties.town || place.properties.village || "";
    const state = place.properties.state || "";
    if (city && city !== name) return `${name}, ${city}, ${state}`;
    if (state) return `${name}, ${state}`;
    return name;
  };

  const selectStart = (place) => {
    setStart(getPlaceName(place));
    setSelectedStart([
      place.geometry.coordinates[0],
      place.geometry.coordinates[1],
    ]);
    setStartSuggestions([]);
  };

  const selectEnd = (place) => {
    setEnd(getPlaceName(place));
    setSelectedEnd([
      place.geometry.coordinates[0],
      place.geometry.coordinates[1],
    ]);
    setEndSuggestions([]);
  };

  const handleSearch = async () => {
    if (!selectedStart || !selectedEnd) {
      alert("Please select source and destination from suggestions!");
      return;
    }

    setLoading(true);
    setSelectedRoute(0);

    try {
      const res = await axios.post("http://localhost:5000/api/routes", {
        startCoords: selectedStart,
        endCoords: selectedEnd,
        vehicle: vehicle,
      });

      setRoutes(res.data.routes);
      setStartCoords(selectedStart);
      setEndCoords(selectedEnd);
    } catch (err) {
      console.error("Routes error:", err);
      alert("Could not fetch routes. Please try again!");
    }

    setLoading(false);
  };

  return (
    <div className="search-bar">

      {/* Vehicle Type Toggle */}
      <div className="vehicle-toggle">
        <button
          className={`vehicle-btn ${vehicle === "car" ? "active" : ""}`}
          onClick={() => setVehicle("car")}
        >
          🚗 Car
        </button>
        <button
          className={`vehicle-btn ${vehicle === "bike" ? "active" : ""}`}
          onClick={() => setVehicle("bike")}
        >
          🏍️ Bike
        </button>
        <button
          className={`vehicle-btn ${vehicle === "foot" ? "active" : ""}`}
          onClick={() => setVehicle("foot")}
        >
          🚶 Walk
        </button>
      </div>

      {/* Source Input */}
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="📍 Source — city, area, landmark..."
          value={start}
          onChange={handleStartChange}
          className="search-input"
        />
        {startSuggestions.length > 0 && (
          <ul className="suggestions">
            {startSuggestions.map((place, i) => (
              <li key={i} onClick={() => selectStart(place)}>
                <span>{getPlaceIcon(place)}</span>
                <span>{getPlaceName(place)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Destination Input */}
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="🏁 Destination — city, area, landmark..."
          value={end}
          onChange={handleEndChange}
          className="search-input"
        />
        {endSuggestions.length > 0 && (
          <ul className="suggestions">
            {endSuggestions.map((place, i) => (
              <li key={i} onClick={() => selectEnd(place)}>
                <span>{getPlaceIcon(place)}</span>
                <span>{getPlaceName(place)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
{/* Use My Location button */}
<button
  className="location-btn"
  onClick={() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported!");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setSelectedStart([longitude, latitude]);
      // Reverse geocode - coords to city name
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const name = res.data.display_name.split(",").slice(0, 2).join(",");
      setStart(name);
    });
  }}
>
  📍 Use My Location
</button>
      <button onClick={handleSearch} className="search-btn">
        🔍 Find Routes
      </button>
    </div>
  );
}

export default SearchBar;
