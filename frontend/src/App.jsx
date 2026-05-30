import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import RiskBrief from './components/RiskBrief';
import SurveillanceMap from './components/SurveillanceMap';
import DetailPanel from './components/DetailPanel';

/**
 * App Component
 * Manages central states coordinating telemetry and news flows.
 */
function App() {
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setSelectedDevice(null); // Clear selected device when switching cities
    setSelectedNews(null); // Clear selected news when switching cities
  };

  return (
    <div className="dashboard-container" id="surveillance-watch-root">
      <Navbar selectedCity={selectedCity} onCityChange={handleCityChange} />
      
      <div className="dashboard-content">
        <StatsBar />
        
        <main className="main-grid" id="dashboard-main-view">
          {/* Left Panel: Risk Brief */}
          <RiskBrief 
            selectedCity={selectedCity}
            selectedNews={selectedNews}
            onNewsClick={setSelectedNews}
          />
          
          {/* Center Panel: Surveillance Analytics Map */}
          <SurveillanceMap 
            selectedCity={selectedCity} 
            selectedDevice={selectedDevice}
            onMarkerClick={setSelectedDevice}
            selectedNews={selectedNews}
            onNewsClick={setSelectedNews}
          />
          
          {/* Right Panel: Device Intelligence */}
          <DetailPanel device={selectedDevice} />
        </main>
      </div>
    </div>
  );
}

export default App;
