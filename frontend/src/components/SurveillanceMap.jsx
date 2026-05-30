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

// Custom zoom levels to optimize visual framing
const cityZooms = {
  Mumbai: 12,
  Delhi: 12,
  Bengaluru: 11 // Slightly zoomed out to prevent side panel collision
};

// Map layer controller for smooth flyTo transitions
function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.2
      });
    }
  }, [center, zoom, map]);
  return null;
}


// Mock dataset for device markers across all three cities
export const MOCK_ASSETS = [
  // Mumbai Devices
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
    owner: 'Mumbai Municipal Corporation',
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
    owner: 'Reliance Capital Group',
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
    owner: 'Bharti Airtel Ltd.',
    details: 'Main telecom exchange. Signals within nominal threshold limits.'
  },

  // Delhi Devices
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
    owner: 'National Informatics Centre',
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
    owner: 'DLF CyberCity Holdings',
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
    owner: 'Bharat Sanchar Nigam Ltd.',
    details: 'Critical fiber gateway node. High rate of dropped packets.'
  },

  // Bengaluru Devices
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
    owner: 'Government of Karnataka',
    details: 'State assembly digital gateway. Cryptographic integrity verified.'
  },
  {
    id: 'BLR-CORP-02',
    name: 'Whitefield IT Park Hub',
    type: 'CORPORATE',
    threatLevel: 'HIGH',
    coordinates: [12.9600, 77.6150],
    status: 'UNSTABLE',
    ip: '172.22.88.19',
    city: 'Bengaluru',
    uptime: '96.22%',
    protocol: 'WireGuard',
    owner: 'Infosys Tech Park',
    details: 'Large enterprise development link. Intrusion warnings registered.'
  },
  {
    id: 'BLR-TEL-03',
    name: 'Indiranagar Core Switch',
    type: 'TELECOM',
    threatLevel: 'MEDIUM',
    coordinates: [12.9780, 77.6250],
    status: 'ACTIVE',
    ip: '192.168.4.5',
    city: 'Bengaluru',
    uptime: '99.92%',
    protocol: 'WPA3',
    owner: 'Reliance Jio Infocomm',
    details: 'Suburban network controller node. Heavy data transmission cycles.'
  }
];

// Rich news intelligence mock dataset across all three cities
export const MOCK_NEWS = [
  // Mumbai News
  {
    id: 'MUM-NEWS-01',
    title: 'Promenade Security Reinforcement',
    category: 'Public Safety',
    timestamp: '2026-05-30T09:12:00Z',
    summary: 'Local authorities deploy additional smart patrol cameras along Marine Drive to monitor high-density crowds and streamline pedestrian lanes.',
    coordinates: [18.9430, 72.8230],
    city: 'Mumbai'
  },
  {
    id: 'MUM-NEWS-02',
    title: 'Suburban Line Delay Broadcast',
    category: 'Transit',
    timestamp: '2026-05-30T08:15:00Z',
    summary: 'Signal failures registered near Dadar station cause major commuter backlog. Operators predict repairs will take approximately two hours.',
    coordinates: [19.0178, 72.8478],
    city: 'Mumbai'
  },
  
  // Delhi News
  {
    id: 'DEL-NEWS-01',
    title: 'Central Zone Assembly Notice',
    category: 'Government Advisory',
    timestamp: '2026-05-30T09:00:00Z',
    summary: 'Public advisory issued regarding localized transit restrictions around India Gate lawns due to scheduled state assembly events.',
    coordinates: [28.6120, 77.2290],
    city: 'Delhi'
  },
  {
    id: 'DEL-NEWS-02',
    title: 'Airport Highway Traffic Reroute',
    category: 'Traffic',
    timestamp: '2026-05-30T07:45:00Z',
    summary: 'VIP movement and minor structural repairs along the main airport tollway trigger multi-kilometer traffic queues. Alternate routes suggested.',
    coordinates: [28.5562, 77.1000],
    city: 'Delhi'
  },

  // Bengaluru News
  {
    id: 'BLR-NEWS-01',
    title: 'Whitefield Smart Transit Launch',
    category: 'Infrastructure',
    timestamp: '2026-05-30T09:30:00Z',
    summary: 'City council inaugurates dynamic signal tracking pilot in IT corridors to automatically adjust green-light cycles during rush hours.',
    coordinates: [12.9480, 77.6020],
    city: 'Bengaluru'
  },
  {
    id: 'BLR-NEWS-02',
    title: 'Subdivision Grid Power Maintenance',
    category: 'Utility',
    timestamp: '2026-05-30T08:00:00Z',
    summary: 'Grid operators announce temporary substation maintenance schedules for Indiranagar, leading to scheduled two-hour backup transitions.',
    coordinates: [12.9820, 77.6110],
    city: 'Bengaluru'
  }
];

// Helper to map UI types to iconFactory system categories
const getMappedType = (type) => {
  if (type === 'GOVERNMENT') return 'SHIELD';
  if (type === 'CORPORATE') return 'DATABASE';
  return 'SATELLITE'; // TELECOM or fallback type
};

// Cache to hold pre-created stable Leaflet L.divIcon instances for devices
const deviceIconCache = {};

const getDeviceIcon = (type, level, isSelected) => {
  const cacheKey = `${type}-${level}-${isSelected ? 'selected' : 'normal'}`;
  if (!deviceIconCache[cacheKey]) {
    const factoryType = getMappedType(type);
    const config = getMapMarkerConfig(factoryType, level);
    deviceIconCache[cacheKey] = L.divIcon({
      className: `${config.className} ${isSelected ? 'surveillance-marker-selected' : ''}`,
      html: config.html,
      iconSize: config.iconSize,
      iconAnchor: config.iconAnchor
    });
  }
  return deviceIconCache[cacheKey];
};

// Pre-created stable Leaflet L.divIcon references for news markers (prevents unstable recreation and flickering)
const normalNewsIcon = L.divIcon({
  className: 'news-marker',
  html: `
    <div class="news-marker-inner" style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0f141f;
      border: 2px solid var(--color-info);
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-info)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <path d="M16 8h2"></path>
        <path d="M16 12h2"></path>
        <path d="M16 16h2"></path>
        <path d="M6 8h6v8H6z"></path>
      </svg>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const selectedNewsIcon = L.divIcon({
  className: 'news-marker news-marker-selected',
  html: `
    <div class="news-marker-inner" style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #0f141f;
      border: 2px solid var(--color-info);
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-info)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <path d="M16 8h2"></path>
        <path d="M16 12h2"></path>
        <path d="M16 16h2"></path>
        <path d="M6 8h6v8H6z"></path>
      </svg>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const getNewsIcon = (isSelected) => {
  return isSelected ? selectedNewsIcon : normalNewsIcon;
};


/**
 * SurveillanceMap Component
 * Integrates Leaflet, filters markers, and handles transitions between Mumbai, Delhi, and Bengaluru.
 */
export function SurveillanceMap({ 
  selectedCity, 
  selectedDevice, 
  onMarkerClick,
  selectedNews,
  onNewsClick
}) {
  const [showDevices, setShowDevices] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showNews, setShowNews] = useState(true);

  const activeCenter = cityCoordinates[selectedCity] || cityCoordinates.Mumbai;
  const activeZoom = cityZooms[selectedCity] || 12;


  // Filter devices based on city context and toggle status
  const filteredDevices = MOCK_ASSETS.filter((asset) => {
    return asset.city === selectedCity && showDevices;
  });

  // Filter news based on city context and toggle status
  const filteredNews = MOCK_NEWS.filter((news) => {
    return news.city === selectedCity && showNews;
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
            zoom={activeZoom} 
            zoomControl={false}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {/* View controller manages dynamic panning / flyTo */}
            <MapViewController center={activeCenter} zoom={activeZoom} />

            {/* Render risk range circles if heatmap is enabled */}
            {showHeatmap && filteredDevices.map((device) => {
              const color = getThreatColor(device.threatLevel);
              return (
                <Circle
                  key={`heat-${device.id}`}
                  center={device.coordinates}
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

            {/* Render device markers */}
            {filteredDevices.map((device) => {
              const isSelected = selectedDevice && device.id === selectedDevice.id;
              return (
                <Marker
                  key={device.id}
                  position={device.coordinates}
                  icon={getDeviceIcon(device.type, device.threatLevel, isSelected)}
                  eventHandlers={{
                    click: (e) => {
                      onMarkerClick(device);
                    }
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: '150px' }}>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{device.name}</strong>
                      <span className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {device.id}</span>
                      <span className="mono" style={{ display: 'block', fontSize: '0.7rem', color: getThreatColor(device.threatLevel), marginTop: '4px', textTransform: 'uppercase' }}>
                        {device.type} • {device.threatLevel}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Render news markers */}
            {filteredNews.map((news) => {
              const isSelected = selectedNews && news.id === selectedNews.id;
              return (
                <Marker
                  key={news.id}
                  position={news.coordinates}
                  icon={getNewsIcon(isSelected)}
                  eventHandlers={{
                    click: (e) => {
                      onNewsClick(news);
                    }
                  }}
                >
                  <Popup>
                    <div style={{ minWidth: '150px' }}>
                      <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{news.title}</strong>
                      <span className="mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-info)', textTransform: 'uppercase' }}>
                        NEWS • {news.category}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

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
