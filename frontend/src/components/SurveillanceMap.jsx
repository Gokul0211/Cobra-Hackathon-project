import React from 'react';

/**
 * SurveillanceMap Component
 * Architectural placeholder for mapping APIs (e.g. Leaflet / Mapbox / OpenLayers).
 */
export function SurveillanceMap() {
  return (
    <section className="panel" id="map-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <h2 className="panel-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
          Tactical Map Interface
        </h2>
        <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPS: SF METRO</span>
      </div>
      
      <div className="panel-content" style={{ padding: 0, position: 'relative' }}>
        <div className="map-container" id="leaflet-map-target">
          <div className="map-placeholder-overlay">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>SURVEILLANCE MAP ENGINE</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: '0 auto' }}>
              Leaflet Map Frame is ready for coordinates binding. Interactive geo-markers, vector layers, and spatial tracking integrate here.
            </p>
          </div>
          
          {/* Tactical Map HUD overlay */}
          <div className="map-hud" id="tactical-map-hud">
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>Layer Control</h4>
            <div className="mono" style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div>[X] Thermal Sensor Overlays</div>
              <div>[X] Traffic Nodes</div>
              <div>[ ] Orbital Sweep Paths</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SurveillanceMap;
