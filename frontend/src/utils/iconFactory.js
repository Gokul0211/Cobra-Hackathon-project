/**
 * Icon factory for generating dashboard SVGs and interactive map marker representations.
 */

import { getThreatColor } from './colorMap';

/**
 * Returns raw SVG path markup or full SVGs for typical OSINT dashboard entities.
 */
export const ENTITY_ICONS = {
  CAMERA: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  SERVER: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
  SATELLITE: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 100-16 8 8 0 000 16z',
  DATABASE: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
  SHIELD: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
};

/**
 * Generates an SVG path for a specific entity type.
 * @param {string} type - Entity type (e.g., 'CAMERA', 'SERVER', 'SATELLITE')
 * @returns {string} The path element or fallback.
 */
export function getEntityIconPath(type) {
  if (!type) return ENTITY_ICONS.SHIELD;
  return ENTITY_ICONS[type.toUpperCase()] || ENTITY_ICONS.SHIELD;
}

/**
 * Returns placeholder configuration for building map icons.
 * Typically combined with Leaflet L.divIcon or other map engines.
 * @param {string} type - The entity type.
 * @param {string} level - The threat level of the entity.
 * @returns {object} Architectural configuration for markers.
 */
export function getMapMarkerConfig(type, level) {
  const color = getThreatColor(level);
  
  return {
    className: `surveillance-marker surveillance-marker-${level.toLowerCase()}`,
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${ENTITY_ICONS[type.toUpperCase()] ? '#0f141f' : color};
        border: 2px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px ${color}80;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="${getEntityIconPath(type)}"></path>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  };
}
