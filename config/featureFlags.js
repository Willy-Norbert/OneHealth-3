// Simple feature flag utility reading from environment variables
// Default off unless explicitly enabled

function isEnabled(envName, defaultValue = false) {
  const raw = process.env[envName]
  if (raw === undefined) return defaultValue
  const val = String(raw).toLowerCase().trim()
  return val === '1' || val === 'true' || val === 'yes' || val === 'on'
}

module.exports = {
  FEATURE_DOCTOR_ADVANCED_NOTIFICATIONS: isEnabled('FEATURE_DOCTOR_ADVANCED_NOTIFICATIONS', false),
  FEATURE_DOCTOR_CALENDAR_2: isEnabled('FEATURE_DOCTOR_CALENDAR_2', false),
}



