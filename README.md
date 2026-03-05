# 🗺️ Routify

> **Your route, your choice.** Routify shows you all possible routes between two locations — not just one.

![Routify Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![Leaflet](https://img.shields.io/badge/Maps-Leaflet.js-orange)

---

## 🚀 The Problem

Google Maps shows only 2-3 routes based on its own algorithm. You have no real choice. What if you know a shortcut? Want a scenic route? Want to avoid tolls?

**Routify solves this** - it shows you all available routes with full details so you can decide.

---

## ✨ Features

- 🛣️ **Multiple Routes** - See up to 3 different route options on the map
- 🎨 **Color Coded** - Blue (Fastest), Green (Alternative 1), Orange (Alternative 2)
-- 📏 **Route Details** - Distance and estimated travel time for each route
- 🔍 **Smart Search** - City search with autocomplete suggestions
- 🗺️ **Interactive Map** - Click any route card to highlight it on the map
- 📍 **Start & End Markers** - Visual markers for source and destination

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Maps | Leaflet.js + OpenStreetMap |
| Backend | Node.js + Express |
| Routing API | GraphHopper API |
| Geocoding | Photon API (Komoot) |

---

## 📁 Project Structure

```
Routify/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map.jsx         # Leaflet map with routes
│   │   │   ├── SearchBar.jsx   # City search with autocomplete
│   │   │   └── RouteCards.jsx  # Route info cards
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── index.html
└── server/                 # Express backend
    ├── index.js            # API routes
    ├── .env.example
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- GraphHopper API key (free at [graphhopper.com](https://graphhopper.com))

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/routify.git
cd routify
```

### 2. Setup the server
```bash
cd server
npm install
cp .env.example .env
# Add your GraphHopper API key to .env
npm run dev
```

### 3. Setup the client
```bash
cd client
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔌 APIs Used

| API | Purpose | Cost |
|-----|---------|------|
| [GraphHopper](https://graphhopper.com) | Route calculation | Free (10k req/day) |
| [Photon by Komoot](https://photon.komoot.io) | City search & geocoding | Free (no key needed) |
| [OpenStreetMap](https://openstreetmap.org) | Map tiles | Free |

---

## 🗺️ How It Works

1. User types source city → Photon API returns suggestions
2. User types destination → same process
3. User clicks "Find Routes" → Express server calls GraphHopper API
4. GraphHopper returns up to 3 alternative routes
5. Routes are drawn on Leaflet map in different colors
6. User clicks a route card to highlight it

---

## 🚧 Roadmap

- [ ] **Phase 2** - Long trip mode with POIs on route
  - ⛽ Petrol pumps along route
  - 🏨 Hotels at stop points
  - 🍽️ Restaurants & dhabas
  - 🏥 Hospitals & police stations
- [ ] Mobile responsive design
- [ ] Save favorite routes
- [ ] Share route via link

---

## 👩‍💻 Author

**Vaibhavi** - Built as a portfolio project to solve a real problem faced during road trips in India.

---

## 📄 License

MIT License - feel free to use and modify.
