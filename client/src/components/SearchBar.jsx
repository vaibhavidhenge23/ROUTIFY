import axios from "axios";
import { useState } from "react";

function SearchBar({ setRoutes, setStartCoords, setEndCoords, setLoading, setSelectedRoute }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);

  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(
        `https://photon.komoot.io/api/?q=${query}&limit=5`
      );
      setSuggestions(res.data.features);
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

  const selectStart = (place) => {
    setStart(place.properties.name);
    setSelectedStart([
      place.geometry.coordinates[0],
      place.geometry.coordinates[1],
    ]);
    setStartSuggestions([]);
  };

  const selectEnd = (place) => {
    setEnd(place.properties.name);
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
      <div className="input-wrapper">
        <input
          type="text"
          placeholder="📍 Source city..."
          value={start}
          onChange={handleStartChange}
          className="search-input"
        />
        {startSuggestions.length > 0 && (
          <ul className="suggestions">
            {startSuggestions.map((place, i) => (
              <li key={i} onClick={() => selectStart(place)}>
                {place.properties.name}, {place.properties.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="input-wrapper">
        <input
          type="text"
          placeholder="🏁 Destination city..."
          value={end}
          onChange={handleEndChange}
          className="search-input"
        />
        {endSuggestions.length > 0 && (
          <ul className="suggestions">
            {endSuggestions.map((place, i) => (
              <li key={i} onClick={() => selectEnd(place)}>
                {place.properties.name}, {place.properties.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={handleSearch} className="search-btn">
        🔍 Find Routes
      </button>
    </div>
  );
}

export default SearchBar;
