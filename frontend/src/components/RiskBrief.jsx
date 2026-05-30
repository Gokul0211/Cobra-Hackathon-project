import React from 'react';

/**
 * RiskBrief Component
 * Lists outstanding risk briefs, system threat vectors, and warnings.
 */
export function RiskBrief() {
  return (
    <section className="panel" id="risk-brief-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <h2 className="panel-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Active Threat Briefs
        </h2>
        <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-critical)' }}>3 ALERTS</span>
      </div>

      <div className="panel-content risk-brief">
        {/* Risk 1 */}
        <div className="risk-card" id="threat-brief-1029">
          <div className="risk-card-header">
            <span className="risk-badge critical">Critical</span>
            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>09:12:00</span>
          </div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Unauthorized SSH Brute-Force Detect</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Multiple intrusion attempts detected from external IP range on main SSH port.
          </p>
        </div>

        {/* Risk 2 */}
        <div className="risk-card" id="threat-brief-1028">
          <div className="risk-card-header">
            <span className="risk-badge high">High</span>
            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>08:45:00</span>
          </div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Video Feed Frame Drop Cascade</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Hardware decoding errors observed on highway traffic node camera node.
          </p>
        </div>

        {/* Risk 3 */}
        <div className="risk-card" id="threat-brief-1027">
          <div className="risk-card-header">
            <span className="risk-badge medium">Medium</span>
            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>07:30:00</span>
          </div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Excessive Query Volume Signature</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Anomalous record access volume registered during database maintenance operations.
          </p>
        </div>
      </div>
    </section>
  );
}

export default RiskBrief;
