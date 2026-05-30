import React from 'react';

/**
 * Navbar Component
 * Renders system branding, global telemetry indicator, and connection status.
 */
export function Navbar() {
  return (
    <header className="navbar" id="main-navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">SW</div>
        <h1 className="navbar-title">SURVEILLANCE WATCH</h1>
      </div>
      
      <div className="navbar-status">
        <span className="status-indicator"></span>
        <span className="mono">SYSTEMS NOMINAL</span>
      </div>
    </header>
  );
}

export default Navbar;
