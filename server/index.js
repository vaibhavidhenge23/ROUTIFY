const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Routify Server Running! 🚀" });
});

app.post("/api/routes", async (req, res) => {
  const { startCoords, endCoords } = req.body;

  try {
    const url = `https://graphhopper.com/api/1/route?point=${startCoords[1]},${startCoords[0]}&point=${endCoords[1]},${endCoords[0]}&profile=car&locale=en&calc_points=true&points_encoded=false&algorithm=alternative_route&alternative_route.max_paths=3&alternative_route.max_weight_factor=2&alternative_route.max_share_factor=0.8&key=${process.env.GRAPHHOPPER_API_KEY}`;

    const response = await axios.get(url);

    const routes = response.data.paths.map((path) => ({
      summary: {
        distance: path.distance,
        duration: path.time / 1000,
      },
      geometry: {
        coordinates: path.points.coordinates,
      },
    }));

    res.json({ routes });
  } catch (error) {
    console.error("GraphHopper Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Could not fetch routes. Please try again!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Routify Server running on port ${PORT} 🚀`);
});
