import { useState, useEffect } from 'react';
import { fetchStats } from '../utils/api';
import { getLegalBadge } from '../utils/legalFramework';

export default function StatsBar({ city }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats(city)
      .then(setStats)
      .catch(console.error);
  }, [city]);

  const legal = getLegalBadge(city);

  return (
    <section className="stats-bar" id="surveillance-stats-bar">
      <div className="stat-item">
        <span className="stat-label">Active Sensors</span>
        <span className="stat-value">{stats?.total_devices || '--'}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label" style={{ color: 'var(--color-critical)' }}>Govt/Telecom</span>
        <span className="stat-value" style={{ color: 'var(--color-critical)' }}>
          {stats ? `${stats.by_owner?.government || 0} / ${stats.by_owner?.telecom || 0}` : '--'}
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Avg Risk Index</span>
        <span className="stat-value">{stats?.surveillance_score?.devices_per_sq_km || '--'} <span style={{fontSize: 10, color: 'var(--text-muted)'}}>dev/km²</span></span>
      </div>
      <div className="stat-item" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="stat-label">Unattributed</span>
          <span className="stat-value">{stats?.surveillance_score?.unknown_percentage || '--'}%</span>
        </div>
        {legal && (
          <span
            id="legal-framework-badge"
            style={{
              fontFamily: 'IBM Plex Mono', fontSize: 10,
              color: legal.badgeColor,
              border: `1px solid ${legal.badgeColor}44`,
              padding: '4px 8px',
              borderRadius: 4,
              whiteSpace: 'nowrap',
              marginLeft: 'auto'
            }}
            title={legal.detail}
          >
            {legal.badge}
          </span>
        )}
      </div>
    </section>
  );
}

