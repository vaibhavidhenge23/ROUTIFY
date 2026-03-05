const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: ["https://routify-five.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json({ limit: "50mb" }));

const poiCache = {};

app.get("/", (req, res) => {
  res.json({ message: "Routify Server Running! 🚀" });
});

app.post("/api/routes", async (req, res) => {
  const { startCoords, endCoords, vehicle } = req.body;
  const profileMap = { car: "car", bike: "bike", foot: "foot" };
  const profile = profileMap[vehicle] || "car";
  try {
    const url = `https://graphhopper.com/api/1/route?point=${startCoords[1]},${startCoords[0]}&point=${endCoords[1]},${endCoords[0]}&profile=${profile}&locale=en&calc_points=true&points_encoded=false&algorithm=alternative_route&alternative_route.max_paths=3&alternative_route.max_weight_factor=2&alternative_route.max_share_factor=0.8&key=${process.env.GRAPHHOPPER_API_KEY}`;
    const response = await axios.get(url);
    const routes = response.data.paths.map((path) => ({
      summary: { distance: path.distance, duration: path.time / 1000 },
      geometry: { coordinates: path.points.coordinates },
    }));
    res.json({ routes });
  } catch (error) {
    console.error("GraphHopper Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Could not fetch routes. Please try again!" });
  }
});
app.post("/api/pois", async (req, res) => {
  const { coords, type } = req.body;

  const searchMap = {
    petrol: "fuel",
    hotels: "hotel",
    restaurants: "restaurant",
    hospitals: "hospital",
    police: "police",
  };

  const searchTerm = searchMap[type];
  if (!searchTerm) return res.status(400).json({ error: "Invalid POI type" });

  const lats = coords.map((c) => c[1]);
  const lngs = coords.map((c) => c[0]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const cacheKey = `${type}-${Math.round(minLat*10)}-${Math.round(maxLat*10)}`;
  if (poiCache[cacheKey]) {
    console.log("Cache hit:", type);
    return res.json({ pois: poiCache[cacheKey] });
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: searchTerm,
          format: "json",
          limit: 50,
          bounded: 1,
          viewbox: `${minLng},${maxLat},${maxLng},${minLat}`,
        },
        headers: { "User-Agent": "Routify/1.0" }
      }
    );

    const pois = response.data.map((el) => ({
      lat: parseFloat(el.lat),
      lng: parseFloat(el.lon),
      name: el.display_name.split(",")[0],
    }));

    poiCache[cacheKey] = pois;
    res.json({ pois });
  } catch (error) {
    console.error("Nominatim Error:", error.message);
    res.status(500).json({ error: "Could not fetch POIs" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Routify Server running on port ${PORT} 🚀`);
});