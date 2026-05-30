import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getMapMarkerConfig } from '../utils/iconFactory';
import { getThreatColor } from '../utils/colorMap';

// City center coordinate mapping
const cityCoordinates = {
  Mumbai: [19.0760, 72.8777],
  Delhi: [28.6139, 77.2090],
  Bengaluru: [12.9716, 77.5946]
};

// Map layer controller for smooth flyTo transitions
function MapViewController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 12, {
        animate: true,
        duration: 1.2
      });
    }
  }, [center, map]);
  return null;
}

// Complete mock dataset for devices and news markers across all three cities
export const MOCK_ASSETS = [
  // Mumbai Assets
  {
    id: 'MUM-GOV-01',
    name: 'Municipal HQ Gateway',
    type: 'GOVERNMENT',
    threatLevel: 'LOW',
    coordinates: [19.0820, 72.8820],
    status: 'ACTIVE',
    ip: '10.20.40.12',
    city: 'Mumbai',
    uptime: '99.99%',
    protocol: 'IPSEC Tunnel',
    details: 'Primary municipal server hub. Encrypted diagnostic routing active.'
  },
  {
    id: 'MUM-CORP-02',
    name: 'Bandra Finance Exchange',
    type: 'CORPORATE',
    threatLevel: 'CRITICAL',
    coordinates: [19.0650, 72.8780],
    status: 'UNSTABLE',
    ip: '172.16.55.99',
    city: 'Mumbai',
    uptime: '92.40%',
    protocol: 'TLS v1.3',
    details: 'Corporate server core. Experiencing anomalous bandwidth utilization.'
  },
  {
    id: 'MUM-TEL-03',
    name: 'Bandra West Signal Tower',
    type: 'TELECOM',
    threatLevel: 'HIGH',
    coordinates: [19.0520, 72.8360],
    status: 'ACTIVE',
    ip: '192.168.88.2',
    city: 'Mumbai',
    uptime: '99.85%',
    protocol: 'WPA3 Enterprise',
    details: 'Main telecom exchange. Signals within nominal threshold limits.'
  },
  {
    id: 'MUM-NEWS-04',
    name: 'Marine Drive Public Alert',
    type: 'NEWS',
    threatLevel: 'MEDIUM',
    coordinates: [18.9430, 72.8230],
    status: 'ACTIVE',
    ip: '10.55.20.1',
    city: 'Mumbai',
    uptime: '97.50%',
    protocol: 'HTTP Live Feed',
    details: 'News update: Local reports show heavy congestion along promenade.'
  },

  // Delhi Assets
  {
    id: 'DEL-GOV-01',
    name: 'Central Secretariat Node',
    type: 'GOVERNMENT',
    threatLevel: 'LOW',
    coordinates: [28.6150, 77.2050],
    status: 'ACTIVE',
    ip: '10.10.10.5',
    city: 'Delhi',
    uptime: '100.00%',
    protocol: 'Secure MPLS',
    details: 'Government central office system gateway. Access control nominal.'
  },
  {
    id: 'DEL-CORP-02',
    name: 'Connaught Place Exchange',
    type: 'CORPORATE',
    threatLevel: 'MEDIUM',
    coordinates: [28.6300, 77.2180],
    status: 'ACTIVE',
    ip: '172.30.12.44',
    city: 'Delhi',
    uptime: '99.90%',
    protocol: 'SSL Gateway',
    details: 'Corporate operations center. Periodic database calibration in progress.'
  },
  {
    id: 'DEL-TEL-03',
    name: 'Nehru Place Signal Relay',
    type: 'TELECOM',
    threatLevel: 'CRITICAL',
    coordinates: [28.5490, 77.2510],
    status: 'UNSTABLE',
    ip: '192.168.10.101',
    city: 'Delhi',
    uptime: '89.12%',
    protocol: 'IPsec',
    details: 'Critical fiber gateway node. High rate of dropped packets.'
  },
  {
    id: 'DEL-NEWS-04',
    name: 'India Gate Assembly Report',
    type: 'NEWS',
    threatLevel: 'INFO',
    coordinates: [28.6120, 77.2290],
    status: 'ACTIVE',
    ip: '10.99.12.8',
    city: 'Delhi',
    uptime: '99.95%',
    protocol: 'RTMP Feed',
    details: 'News update: Peaceful public gathering observed near central lawns.'
  },

  // Bengaluru Assets
  {
    id: 'BLR-GOV-01',
    name: 'Vidhana Soudha Control Gate',
    type: 'GOVERNMENT',
    threatLevel: 'LOW',
    coordinates: [12.9790, 77.5900],
    status: 'ACTIVE',
    ip: '10.30.22.4',
    city: 'Bengaluru',
    uptime: '99.99%',
    protocol: 'IPSEC Crypt',
    details: 'State assembly digital gateway. Cryptographic integrity verified.'
  },
  {
    id: 'BLR-CORP-02',
    name: 'Whitefield IT Park Hub',
    type: 'CORPORATE',
    threatLevel: 'HIGH',
    coordinates: [12.9560, 77.7010],
    status: 'UNSTABLE',
    ip: '172.22.88.19',
    city: 'Bengaluru',
    uptime: '96.22%',
    protocol: 'WireGuard',
    details: 'Large enterprise development link. Intrusion warnings registered.'
  },
  {
    id: 'BLR-TEL-03',
    name: 'Indiranagar Core Switch',
    type: 'TELECOM',
    threatLevel: 'MEDIUM',
    coordinates: [12.9780, 77.6410],
    status: 'ACTIVE',
    ip: '192.168.4.5',
    city: 'Bengaluru',
    uptime: '99.92%',
    protocol: 'WPA3',
    details: 'Suburban network controller node. Heavy data transmission cycles.'
  },
  {
    id: 'BLR-NEWS-04',
    name: 'MG Road Metro Event News',
    type: 'NEWS',
    threatLevel: 'LOW',
    coordinates: [12.9740, 77.6080],
    status: 'ACTIVE',
    ip: '10.220.10.9',
    city: 'Bengaluru',
    uptime: '99.10%',
    protocol: 'Live RTMP',
    details: 'News update: Suburban transit operating at maximum passenger volume.'
  }
];

// Helper to map UI types to iconFactory system categories
const getMappedType = (type) => {
  if (type === 'GOVERNMENT') return 'SHIELD';
  if (type === 'CORPORATE') return 'DATABASE';
  if (type === 'TELECOM') return 'SATELLITE';
  return 'CAMERA'; // Default news or fallback type
};

// Generates the custom HTML Leaflet Icon depending on properties
const createLeafletIcon = (type, level) => {
  const factoryType = getMappedType(type);
  const config = getMapMarkerConfig(factoryType, level);
  
  return L.divIcon({
    className: config.className,
    html: config.html,
    iconSize: config.iconSize,
    iconAnchor: config.iconAnchor
  });
};

/**
 * SurveillanceMap Component
 * Integrates Leaflet, filters markers, and handles transitions between Mumbai, Delhi, and Bengaluru.
 */
export function SurveillanceMap({ selectedCity, onMarkerClick }) {
  const [showDevices, setShowDevices] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showNews, setShowNews] = useState(true);

  const activeCenter = cityCoordinates[selectedCity] || cityCoordinates.Mumbai;

  // Filter assets based on layer checkbox status and city context
  const filteredAssets = MOCK_ASSETS.filter((asset) => {
    if (asset.city !== selectedCity) return false;
    if (asset.type === 'NEWS') return showNews;
    return showDevices; // GOV, CORP, TEL fall under Devices
  });

  return (
    <section className="panel" id="map-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <h2 className="panel-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
          Surveillance Analytics
        </h2>
        <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>GPS: {selectedCity.toUpperCase()}</span>
      </div>
      
      <div className="panel-content" style={{ padding: 0, position: 'relative' }}>
        <div className="map-container" id="leaflet-map-target">
          <MapContainer 
            center={activeCenter} 
            zoom={12} 
            zoomControl={false}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {/* View controller manages dynamic panning / flyTo */}
            <MapViewController center={activeCenter} />

            {/* Render risk range circles if heatmap is enabled */}
            {showHeatmap && filteredAssets.map((asset) => {
              const color = getThreatColor(asset.threatLevel);
              return (
                <Circle
                  key={`heat-${asset.id}`}
                  center={asset.coordinates}
                  radius={700}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.12,
                    weight: 1
                  }}
                />
              );
            })}

            {/* Render markers */}
            {filteredAssets.map((asset) => (
              <Marker
                key={asset.id}
                position={asset.coordinates}
                icon={createLeafletIcon(asset.type, asset.threatLevel)}
                eventHandlers={{
                  click: () => onMarkerClick(asset)
                }}
              >
                <Popup>
                  <div style={{ minWidth: '150px' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{asset.name}</strong>
                    <span className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {asset.id}</span>
                    <span className="mono" style={{ display: 'block', fontSize: '0.7rem', color: getThreatColor(asset.threatLevel), marginTop: '4px', textTransform: 'uppercase' }}>
                      {asset.type} • {asset.threatLevel}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Layer Control HUD */}
          <div className="map-hud" id="surveillance-layer-hud">
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '6px' }}>Layer Control</h4>
            <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={showDevices} 
                  onChange={(e) => setShowDevices(e.target.checked)}
                  style={{ accentColor: 'var(--color-info)' }} 
                /> Devices
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={showHeatmap} 
                  onChange={(e) => setShowHeatmap(e.target.checked)}
                  style={{ accentColor: 'var(--color-info)' }} 
                /> Heatmap
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={showNews} 
                  onChange={(e) => setShowNews(e.target.checked)}
                  style={{ accentColor: 'var(--color-info)' }} 
                /> News
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SurveillanceMap;
