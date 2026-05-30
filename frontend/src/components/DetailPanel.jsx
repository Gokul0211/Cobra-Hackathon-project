import React from 'react';
import { getThreatColor } from '../utils/colorMap';

/**
 * DetailPanel Component
 * Displays system diagnostics, network properties, and configuration state of a selected device.
 */
export function DetailPanel({ device }) {
  if (!device) {
    return (
      <section className="panel detail-panel" id="detail-metadata-panel" style={{ height: '100%' }}>
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

  const riskColor = getThreatColor(device.threatLevel);

  return (
    <section className="panel detail-panel" id="detail-metadata-panel" style={{ height: '100%' }}>
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
        <span className="mono" style={{ fontSize: '0.75rem', color: riskColor, fontWeight: 'bold' }}>{device.id}</span>
      </div>

      <div className="panel-content">
        <div className="metadata-grid" id="telemetry-metadata-grid">
          <span className="metadata-label">Device Name</span>
          <span className="metadata-value">{device.name}</span>

          <span className="metadata-label">Device Type</span>
          <span className="metadata-value">{device.type}</span>

          <span className="metadata-label">IP Address</span>
          <span className="metadata-value">{device.ip}</span>

          <span className="metadata-label">Network Protocol</span>
          <span className="metadata-value">{device.protocol || 'Encrypted Tunnel'}</span>

          <span className="metadata-label">Uptime Metric</span>
          <span className="metadata-value">{device.uptime || '99.9%'}</span>

          <span className="metadata-label">Risk Severity</span>
          <span className="metadata-value" style={{ color: riskColor, fontWeight: 'bold' }}>{device.threatLevel}</span>

          <span className="metadata-label">Status Flag</span>
          <span className="metadata-value" style={{ color: riskColor }}>{device.status}</span>
        </div>

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Device Diagnostic Summary</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            {device.details}
          </p>
        </div>
      </div>
    </section>
  );
}

export default DetailPanel;
