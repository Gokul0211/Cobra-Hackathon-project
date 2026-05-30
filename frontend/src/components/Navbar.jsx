import React from 'react';

/**
 * Navbar Component
 * Renders system branding and city selector.
 */
export function Navbar() {
  return (
    <header className="navbar" id="main-navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">SW</div>
        <h1 className="navbar-title">SurveillanceWatch</h1>
      </div>
      
      <div className="city-selector-container">
        <label htmlFor="city-select" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '4px' }}>Region:</label>
        <select id="city-select" className="city-select" defaultValue="Mumbai">
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Bengaluru">Bengaluru</option>
        </select>
      </div>
    </header>
  );
}

export default Navbar;

