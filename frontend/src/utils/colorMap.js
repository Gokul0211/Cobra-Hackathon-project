/**
 * Color mapping utilities for threat levels and system statuses in SurveillanceWatch.
 */

export const THEME_COLORS = {
  bgPrimary: '#080b11',
  bgSecondary: '#0f141f',
  bgTertiary: '#161d2d',
  border: '#1e293b',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b'
};

export const THREAT_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#10b981',
  INFO: '#3b82f6',
  UNKNOWN: '#64748b'
};

/**
 * Returns the hex code or RGBA styling for a given threat level.
 * @param {string} level - The threat level (e.g., 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW')
 * @returns {string} The color hex code.
 */
export function getThreatColor(level) {
  if (!level) return THREAT_COLORS.UNKNOWN;
  const normalized = level.toUpperCase();
  return THREAT_COLORS[normalized] || THREAT_COLORS.UNKNOWN;
}

/**
 * Returns background and border styles suitable for badges or cards.
 * @param {string} level - The threat level.
 * @returns {object} { background, color, borderColor }
 */
export function getThreatBadgeStyle(level) {
  const color = getThreatColor(level);
  return {
    backgroundColor: `${color}1A`, // 10% opacity hex
    color: color,
    border: `1px solid ${color}33` // 20% opacity hex
  };
}
