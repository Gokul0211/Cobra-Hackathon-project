/**
 * API client placeholder for SurveillanceWatch.
 * Simulates network requests and provides architectural schemas for data loading.
 */

// Simulated network latency
const LATENCY = 400;

const MOCK_STATS = {
  activeSensors: 1422,
  criticalAlerts: 14,
  averageRiskIndex: 42,
  networkLoad: '68%'
};

const MOCK_SENSORS = [
  {
    id: 'CAM-081',
    name: 'CCTV Traffic Node 4',
    type: 'CAMERA',
    threatLevel: 'HIGH',
    coordinates: [37.7749, -122.4194],
    status: 'ACTIVE',
    ip: '192.168.12.81'
  },
  {
    id: 'SRV-042',
    name: 'Mainframe Controller Hub',
    type: 'SERVER',
    threatLevel: 'CRITICAL',
    coordinates: [37.7833, -122.4167],
    status: 'COMPROMISED',
    ip: '10.0.4.42'
  },
  {
    id: 'SAT-902',
    name: 'Orbital Recon Sentinel',
    type: 'SATELLITE',
    threatLevel: 'LOW',
    coordinates: [37.7699, -122.4468],
    status: 'ACTIVE',
    ip: '172.16.89.9'
  },
  {
    id: 'DB-009',
    name: 'Biometric Records Vault',
    type: 'DATABASE',
    threatLevel: 'MEDIUM',
    coordinates: [37.7599, -122.4368],
    status: 'MAINTENANCE',
    ip: '10.8.0.9'
  }
];

const MOCK_RISK_BRIEFS = [
  {
    id: 'RB-1029',
    timestamp: '2026-05-30T09:12:00Z',
    source: 'SRV-042',
    threatLevel: 'CRITICAL',
    title: 'Unauthorized SSH Brute-Force Detect',
    summary: 'Multiple intrusion attempts detected from external IP range. Authentication logs indicate persistent scanning activities.'
  },
  {
    id: 'RB-1028',
    timestamp: '2026-05-30T08:45:00Z',
    source: 'CAM-081',
    threatLevel: 'HIGH',
    title: 'Video Feed Frame Drop Cascade',
    summary: 'Hardware decoding errors observed on highway main node. Potential local electromagnetic interference or hardware decay.'
  },
  {
    id: 'RB-1027',
    timestamp: '2026-05-30T07:30:00Z',
    source: 'DB-009',
    threatLevel: 'MEDIUM',
    title: 'Excessive Query Volume Signature',
    summary: 'Anomalous record access volume registered during scheduled maintenance hours. Originating client system is being audited.'
  }
];

export const api = {
  /**
   * Fetches high-level surveillance system metrics.
   */
  async getSystemStats() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_STATS), LATENCY);
    });
  },

  /**
   * Fetches sensor markers for rendering on maps.
   */
  async getSensors() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_SENSORS), LATENCY);
    });
  },

  /**
   * Fetches detailed state metadata for a single entity.
   */
  async getSensorDetails(sensorId) {
    return new Promise((resolve) => {
      const match = MOCK_SENSORS.find((s) => s.id === sensorId) || MOCK_SENSORS[0];
      setTimeout(() => {
        resolve({
          ...match,
          uptime: '99.98%',
          lastHeartbeat: new Date().toISOString(),
          firmwareVersion: 'v2.8.4-build092',
          ownerDepartment: 'Global Security Operations',
          networkProtocol: 'TLS v1.3 encrypted'
        });
      }, LATENCY);
    });
  },

  /**
   * Fetches threat events and system briefing objects.
   */
  async getRiskBriefs() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_RISK_BRIEFS), LATENCY);
    });
  }
};

export default api;
