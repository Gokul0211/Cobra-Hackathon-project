import React from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import RiskBrief from './components/RiskBrief';
import SurveillanceMap from './components/SurveillanceMap';
import DetailPanel from './components/DetailPanel';

/**
 * App Component
 * Integrates the top navigation, metrics bar, and primary tactical dashboard grid.
 */
function App() {
  return (
    <div className="dashboard-container" id="surveillance-watch-root">
      <Navbar />
      
      <div className="dashboard-content">
        <StatsBar />
        
        <main className="main-grid" id="dashboard-main-view">
          {/* Left Panel: Risk & Warnings */}
          <RiskBrief />
          
          {/* Center Panel: Map Tracking Visualizer */}
          <SurveillanceMap />
          
          {/* Right Panel: Selected Entity Telemetry */}
          <DetailPanel />
        </main>
      </div>
    </div>
  );
}

export default App;
