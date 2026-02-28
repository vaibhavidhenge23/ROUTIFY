import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const routeColors = ["#3B82F6", "#10B981", "#F97316"];

function Map({ routes, selectedRoute, startCoords, endCoords }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayersRef = useRef([]);
  const markersRef = useRef([]);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView(
      [20.5937, 78.9629],
      5
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstanceRef.current);
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    routeLayersRef.current.forEach((layer) =>
      mapInstanceRef.current.removeLayer(layer)
    );
    routeLayersRef.current = [];

    markersRef.current.forEach((marker) =>
      mapInstanceRef.current.removeLayer(marker)
    );
    markersRef.current = [];

    if (routes.length === 0) return;

    routes.forEach((route, index) => {
      const coords = route.geometry.coordinates.map((coord) => [
        coord[1],
        coord[0],
      ]);

      const polyline = L.polyline(coords, {
        color: routeColors[index],
        weight: selectedRoute === index ? 6 : 3,
        opacity: selectedRoute === index ? 1 : 0.4,
      }).addTo(mapInstanceRef.current);

      routeLayersRef.current.push(polyline);
    });

    if (startCoords) {
      const startMarker = L.marker([startCoords[1], startCoords[0]])
        .addTo(mapInstanceRef.current)
        .bindPopup("📍 Start")
        .openPopup();
      markersRef.current.push(startMarker);
    }

    if (endCoords) {
      const endMarker = L.marker([endCoords[1], endCoords[0]])
        .addTo(mapInstanceRef.current)
        .bindPopup("🏁 Destination");
      markersRef.current.push(endMarker);
    }

    if (routeLayersRef.current.length > 0) {
      const group = L.featureGroup(routeLayersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds(), {
        padding: [50, 50],
      });
    }
  }, [routes]);

  useEffect(() => {
    routeLayersRef.current.forEach((layer, index) => {
      layer.setStyle({
        weight: selectedRoute === index ? 6 : 3,
        opacity: selectedRoute === index ? 1 : 0.4,
      });
    });
  }, [selectedRoute]);

  return (
    <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
  );
}

export default Map;
