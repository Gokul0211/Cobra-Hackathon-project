import React from 'react';

/**
 * StatsBar Component
 * Renders metrics highlights at the top of the interface.
 */
export function StatsBar() {
  return (
    <section className="stats-bar" id="surveillance-stats-bar">
      <div className="stat-item" id="stat-active-sensors">
        <span className="stat-label">Active Sensors</span>
        <span className="stat-value">1,422</span>
      </div>
      <div className="stat-item" id="stat-critical-alerts">
        <span className="stat-label" style={{ color: 'var(--color-critical)' }}>Critical Alerts</span>
        <span className="stat-value" style={{ color: 'var(--color-critical)' }}>14</span>
      </div>
      <div className="stat-item" id="stat-risk-index">
        <span className="stat-label">Avg Risk Index</span>
        <span className="stat-value">42%</span>
      </div>
      <div className="stat-item" id="stat-network-load">
        <span className="stat-label">Network Sync</span>
        <span className="stat-value">68%</span>
      </div>
    </section>
  );
}

export default StatsBar;

