import React from 'react';
import { MOCK_NEWS } from './SurveillanceMap';

/**
 * RiskBrief Component
 * Lists outstanding risk briefs and news intelligence updates.
 */
export function RiskBrief({ selectedCity, selectedNews, onNewsClick }) {
  // Filter news for the active city
  const cityNews = MOCK_NEWS.filter((news) => news.city === selectedCity);

  return (
    <section className="panel" id="risk-brief-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <h2 className="panel-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Risk Brief
        </h2>
        <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-info)' }}>
          {cityNews.length} UPDATES
        </span>
      </div>

      <div className="panel-content risk-brief">
        {/* Selected News Intelligence Display */}
        {selectedNews ? (
          <div 
            className="risk-card" 
            style={{ 
              borderColor: 'var(--color-info)', 
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              marginBottom: '16px'
            }}
          >
            <div className="risk-card-header">
              <span className="risk-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--color-info)' }}>
                Active Briefing
              </span>
              <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {new Date(selectedNews.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
              {selectedNews.title}
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', margin: '4px 0' }}>
              <span className="mono">Category: {selectedNews.category}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4' }}>
              {selectedNews.summary}
            </p>
          </div>
        ) : (
          <div style={{ padding: '8px 0 16px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center' }}>
            Select a blue news marker on the map to display dynamic intelligence briefs here.
          </div>
        )}

        {/* List of all news items for the active city */}
        <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Regional Feed ({selectedCity})
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {cityNews.map((news) => {
            const isSelected = selectedNews && news.id === selectedNews.id;
            return (
              <div 
                key={news.id} 
                className="risk-card" 
                onClick={() => onNewsClick(news)}
                style={{ 
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--color-info)' : 'var(--border-color)',
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.04)' : ''
                }}
              >
                <div className="risk-card-header">
                  <span className="risk-badge low">{news.category}</span>
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {new Date(news.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 500, color: isSelected ? 'var(--color-info)' : 'var(--text-primary)' }}>
                  {news.title}
                </h4>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default RiskBrief;
