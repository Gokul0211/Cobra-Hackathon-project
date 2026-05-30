import React from 'react';
import { ownerColor } from '../utils/colorMap';

export default function DetailPanel({ selected, city, showLinks, onToggleLinks, onClose }) {
  if (!selected || selected.type !== 'device') {
    return (
      <section className="panel detail-panel" id="detail-metadata-panel">
        <div className="panel-header">
          <h2 className="panel-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="13" x2="15" y2="13"></line>
              <line x1="9" y1="17" x2="13" y2="17"></line>
            </svg>
            Device Intelligence
          </h2>
        </div>
        <div className="panel-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>
          Select an asset marker on the map to inspect intelligence logs.
        </div>
      </section>
    );
  }

  const device = selected.data;
  const color = ownerColor(device.owner_type);

  // Safe coordinate display — lat/lon come from GeoJSON properties (now included in fix)
  const coordStr = (device.lat != null && device.lon != null)
    ? `[${Number(device.lat).toFixed(4)}, ${Number(device.lon).toFixed(4)}]`
    : 'Coordinates unavailable';

  // Safe IP masking
  const maskedIp = device.ip
    ? device.ip.split('.').slice(0, 2).join('.') + '.*.*'
    : 'Unknown';

  return (
    <section className="panel detail-panel" id="detail-metadata-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <h2 className="panel-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="9"></line>
            <line x1="9" y1="13" x2="15" y2="13"></line>
            <line x1="9" y1="17" x2="13" y2="17"></line>
          </svg>
          Device Intelligence
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mono" style={{ fontSize: '0.75rem', color: color, fontWeight: 'bold' }}>
            {maskedIp}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
              title="Close"
            >✕</button>
          )}
        </div>
      </div>

      <div className="panel-content" style={{ overflowY: 'auto' }}>
        <div className="metadata-grid" id="telemetry-metadata-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '12px 8px',
          fontSize: '0.8rem',
        }}>
          <span className="metadata-label" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Manufacturer</span>
          <span className="metadata-value">{device.manufacturer || 'Unknown'}</span>

          <span className="metadata-label" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Device Type</span>
          <span className="metadata-value">{device.device_type || 'Unknown'}</span>

          <span className="metadata-label" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Owner Class</span>
          <span className="metadata-value" style={{ color: color, textTransform: 'uppercase', fontWeight: 500 }}>
            {device.owner_type || 'unknown'}
          </span>

          <span className="metadata-label" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Org Name</span>
          <span className="metadata-value">{device.org || device.owner_org || 'Unattributed ASN'}</span>

          <span className="metadata-label" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Coordinates</span>
          <span className="metadata-value mono" style={{ fontSize: '0.7rem' }}>{coordStr}</span>

          <span className="metadata-label" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Open Ports</span>
          <span className="metadata-value mono">
            {Array.isArray(device.ports) && device.ports.length > 0
              ? device.ports.join(', ')
              : 'None detected'}
          </span>

          <span className="metadata-label" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confidence</span>
          <span className="metadata-value" style={{ textTransform: 'uppercase' }}>
            {device.ownership_confidence || 'low'}
          </span>

          <span className="metadata-label" style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>City Area</span>
          <span className="metadata-value">{city}</span>
        </div>

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Shodan Banner Dump</h3>
          <pre className="mono" style={{
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            lineHeight: '1.5',
            background: 'var(--bg-primary)',
            padding: 8,
            overflowX: 'hidden',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word'
          }}>
            {device.os ? `OS: ${device.os}\n` : ''}
            {device.isp ? `ISP: ${device.isp}\n` : ''}
            {device.banner_snippet ? `BANNER: ${device.banner_snippet}\n` : ''}
            LAST SEEN: {device.last_update || device.last_seen || 'Unknown'}
          </pre>
        </div>

        {/* Entity Link Graph toggle */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
          <button
            id="entity-link-graph-btn"
            onClick={onToggleLinks}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: showLinks ? 'rgba(231, 76, 60, 0.15)' : 'var(--bg-primary)',
              border: `1px solid ${showLinks ? '#e74c3c' : 'var(--border-color)'}`,
              color: showLinks ? '#e74c3c' : 'var(--text-secondary)',
              borderRadius: 4,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {showLinks ? '⬡ Hide Network Links' : '⬡ Show Network Links'}
          </button>
        </div>
      </div>
    </section>
  );
}
