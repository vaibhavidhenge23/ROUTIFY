import axios from "axios";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const routeColors = ["#3B82F6", "#10B981", "#F97316"];
const poiIcons = {
  petrol: "⛽", hotels: "🏨", restaurants: "🍽️", hospitals: "🏥", police: "🚓",
};

function createPoiIcon(emoji) {
  return L.divIcon({
    html: `<div style="font-size:22px">${emoji}</div>`,
    className: "", iconAnchor: [11, 11],
  });
}

function Map({ routes, selectedRoute, startCoords, endCoords, activePois, routeCoords, setRouteCoords }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayersRef = useRef([]);
  const markersRef = useRef([]);
  const poiLayersRef = useRef({});
  const prevPoisRef = useRef([]);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    mapInstanceRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstanceRef.current);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        mapInstanceRef.current.setView([pos.coords.latitude, pos.coords.longitude], 12);
      });
    }
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    routeLayersRef.current.forEach((l) => mapInstanceRef.current.removeLayer(l));
    routeLayersRef.current = [];
    markersRef.current.forEach((m) => mapInstanceRef.current.removeLayer(m));
    markersRef.current = [];
    Object.values(poiLayersRef.current).forEach((arr) => arr.forEach((m) => mapInstanceRef.current.removeLayer(m)));
    poiLayersRef.current = {};
    prevPoisRef.current = [];
    if (routes.length === 0) return;
    routes.forEach((route, index) => {
      const coords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
      const poly = L.polyline(coords, {
        color: routeColors[index],
        weight: selectedRoute === index ? 6 : 3,
        opacity: selectedRoute === index ? 1 : 0.4,
      }).addTo(mapInstanceRef.current);
      routeLayersRef.current.push(poly);
    });
    if (routes[selectedRoute] && setRouteCoords) setRouteCoords(routes[selectedRoute].geometry.coordinates);
    if (startCoords) {
      markersRef.current.push(L.marker([startCoords[1], startCoords[0]]).addTo(mapInstanceRef.current).bindPopup("📍 Start").openPopup());
    }
    if (endCoords) {
      markersRef.current.push(L.marker([endCoords[1], endCoords[0]]).addTo(mapInstanceRef.current).bindPopup("🏁 Destination"));
    }
    if (routeLayersRef.current.length > 0) {
      mapInstanceRef.current.fitBounds(L.featureGroup(routeLayersRef.current).getBounds(), { padding: [50, 50] });
    }
  }, [routes]);

  useEffect(() => {
    routeLayersRef.current.forEach((l, i) => {
      l.setStyle({ weight: selectedRoute === i ? 6 : 3, opacity: selectedRoute === i ? 1 : 0.4 });
    });
    if (routes[selectedRoute] && setRouteCoords) setRouteCoords(routes[selectedRoute].geometry.coordinates);
  }, [selectedRoute]);

  useEffect(() => {
    if (!mapInstanceRef.current || !routeCoords || routeCoords.length === 0) return;
    const prev = prevPoisRef.current;
    const curr = activePois || [];
    prev.filter((p) => !curr.includes(p)).forEach((type) => {
      (poiLayersRef.current[type] || []).forEach((m) => mapInstanceRef.current.removeLayer(m));
      delete poiLayersRef.current[type];
    });
    curr.filter((p) => !prev.includes(p)).forEach(async (type) => {
      try {
        const res = await axios.post("https://routify-app.up.railway.app/api/pois", { coords: routeCoords, type });
        const markers = res.data.pois.slice(0, 50).map((poi) =>
          L.marker([poi.lat, poi.lng], { icon: createPoiIcon(poiIcons[type]) })
            .addTo(mapInstanceRef.current)
            .bindPopup(`${poiIcons[type]} ${poi.name}`)
        );
        poiLayersRef.current[type] = markers;
      } catch (err) {
        console.error("POI error:", err.message);
      }
    });
    prevPoisRef.current = curr;
  }, [activePois]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>;
}

export default Map;