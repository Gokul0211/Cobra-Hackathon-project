import L from 'leaflet';
import { ownerColor } from './colorMap';

export function createDeviceIcon(ownerType, deviceType) {
  const color = ownerColor(ownerType);
  const size = (deviceType === 'IP Camera' || deviceType === 'DVR/NVR') ? 10 : 8;
  const r = size / 2 - 1;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="${color}" stroke="${color}" stroke-opacity="0.3" stroke-width="2"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
}

export function createNewsIcon(isVerified) {
  // Verified pins are slightly bigger with a brighter fill
  const size = isVerified ? 14 : 12;
  const fill = isVerified ? '#2e86c1' : '#2471a3';
  const opacity = isVerified ? '1' : '0.85';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect x="1" y="1" width="${size-2}" height="${size-2}" fill="${fill}" opacity="${opacity}" rx="1"/>
      ${isVerified ? `<line x1="3" y1="${size/2}" x2="${size-3}" y2="${size/2}" stroke="#fff" stroke-width="1.5"/>` : ''}
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
}
