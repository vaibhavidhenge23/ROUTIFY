function RouteCards({ routes, selectedRoute, setSelectedRoute, loading }) {
  if (loading) {
    return (
      <div className="loading">
        <p>🔍 Searching for routes...</p>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="no-routes">
        <p>📍 Enter source and destination to see routes!</p>
      </div>
    );
  }

  const routeColors = ["#3B82F6", "#10B981", "#F97316"];
  const routeNames = ["Fastest Route", "Alternative 1", "Alternative 2"];

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const formatDistance = (meters) => {
    return (meters / 1000).toFixed(1) + " km";
  };

  return (
    <div className="route-cards">
      <h3>🛣️ Available Routes</h3>
      {routes.map((route, index) => (
        <div
          key={index}
          className={`route-card ${selectedRoute === index ? "active" : ""}`}
          onClick={() => setSelectedRoute(index)}
          style={{ borderLeft: `4px solid ${routeColors[index]}` }}
        >
          <div className="route-header">
            <span className="route-dot" style={{ backgroundColor: routeColors[index] }}></span>
            <span className="route-name">{routeNames[index]}</span>
            {selectedRoute === index && (
              <span className="selected-badge">✓ Selected</span>
            )}
          </div>
          <div className="route-info">
            <div className="info-item">
              <span className="info-icon">📏</span>
              <span>{formatDistance(route.summary.distance)}</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⏱️</span>
              <span>{formatTime(route.summary.duration)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RouteCards;
