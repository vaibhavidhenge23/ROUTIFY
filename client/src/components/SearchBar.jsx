import axios from "axios";
import { useState } from "react";

function SearchBar({ setRoutes, setStartCoords, setEndCoords, setLoading, setSelectedRoute, tripMode }) {
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
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: query,
            format: "json",
            limit: 8,
            countrycodes: "in",
            addressdetails: 1,
            "accept-language": "en",
          },
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      setSuggestions(res.data);
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

  const getDisplayName = (place) => {
    const parts = place.display_name.split(",");
    return parts.slice(0, 3).join(",").trim();
  };

  const selectStart = (place) => {
    setStart(getDisplayName(place));
    setSelectedStart([parseFloat(place.lon), parseFloat(place.lat)]);
    setStartSuggestions([]);
  };

  const selectEnd = (place) => {
    setEnd(getDisplayName(place));
    setSelectedEnd([parseFloat(place.lon), parseFloat(place.lat)]);
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
        tripMode: tripMode,
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
          placeholder="📍 Search source..."
          value={start}
          onChange={handleStartChange}
          className="search-input"
        />
        {startSuggestions.length > 0 && (
          <ul className="suggestions">
            {startSuggestions.map((place, i) => (
              <li key={i} onClick={() => selectStart(place)}>
                <span className="suggestion-icon">
                  {place.type === "city" || place.type === "town" ? "🏙️" :
                   place.type === "restaurant" ? "🍽️" :
                   place.type === "hospital" ? "🏥" :
                   place.type === "fuel" ? "⛽" : "📍"}
                </span>
                {getDisplayName(place)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="input-wrapper">
        <input
          type="text"
          placeholder="🏁 Search destination..."
          value={end}
          onChange={handleEndChange}
          className="search-input"
        />
        {endSuggestions.length > 0 && (
          <ul className="suggestions">
            {endSuggestions.map((place, i) => (
              <li key={i} onClick={() => selectEnd(place)}>
                <span className="suggestion-icon">
                  {place.type === "city" || place.type === "town" ? "🏙️" :
                   place.type === "restaurant" ? "🍽️" :
                   place.type === "hospital" ? "🏥" :
                   place.type === "fuel" ? "⛽" : "📍"}
                </span>
                {getDisplayName(place)}
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
