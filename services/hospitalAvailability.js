const axios = require('axios');
const Hospital = require('../models/Hospital');
const Appointment = require('../models/Appointment');
const SlotLock = require('../models/SlotLock');

// Helper to generate HH:MM AM/PM time labels at 30-min intervals
function generateSlotsFromWorkingHours(workingHoursForDay) {
  if (!workingHoursForDay || !workingHoursForDay.start || !workingHoursForDay.end) return [];
  const toMinutes = (t) => {
    // expects 'HH:MM' in 24h format or 'HH:MM AM/PM'
    const ampmMatch = /(AM|PM)$/i.test(t);
    let [h, m] = t.replace(/\s?(AM|PM)/i, '').split(':').map(Number);
    if (ampmMatch) {
      const isPM = /PM$/i.test(t);
      if (isPM && h < 12) h += 12;
      if (!isPM && h === 12) h = 0;
    }
    return h * 60 + (m || 0);
  };
  const toLabel = (mins) => {
    let h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (h === 0) h = 12;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const startMins = toMinutes(workingHoursForDay.start);
  const endMins = toMinutes(workingHoursForDay.end);
  const slots = [];
  for (let t = startMins; t + 30 <= endMins; t += 30) {
    slots.push(toLabel(t));
  }
  return slots;
}

async function fetchExternalSlots(externalApiUrl, { date, department }) {
  try {
    const { data } = await axios.get(externalApiUrl, { params: { date, department } });
    // Expecting data to be { slots: string[] } or string[]
    const slots = Array.isArray(data) ? data : data?.slots;
    if (Array.isArray(slots)) return slots;
    return [];
  } catch (e) {
    return [];
  }
}

exports.getAvailableSlots = async ({ hospitalId, date, department }) => {
  console.log('🔍 getAvailableSlots called with:', { hospitalId, date, department });
  
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) throw new Error('Hospital not found');

  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) throw new Error('Invalid date');
  
  console.log('📅 Date object created:', dateObj);

  // Try external first
  let baseSlots = [];
  if (hospital.externalApiUrl) {
    baseSlots = await fetchExternalSlots(hospital.externalApiUrl, { date, department });
    console.log('🌐 External slots fetched:', baseSlots);
  }

  // Fallback to local working hours
  if (!baseSlots || baseSlots.length === 0) {
    const day = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const wh = hospital.workingHours?.[day];
    console.log('🏥 Using local working hours for', day, ':', wh);
    baseSlots = generateSlotsFromWorkingHours(wh);
    console.log('⏰ Generated base slots:', baseSlots);
  }

  // Helper to normalize time formats for consistent comparison
  const normalizeTimeToAMPM = (timeStr) => {
    if (!timeStr) return '';
    
    // If already in AM/PM format, return as-is
    if (/(AM|PM)$/i.test(timeStr)) return timeStr;
    
    // Convert 24-hour format to AM/PM
    const [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
  };

  const normalizeTo24Hour = (timeStr) => {
    if (!timeStr) return '';
    
    // If already in 24-hour format, return as-is
    if (!/\s?(AM|PM)$/i.test(timeStr)) return timeStr;
    
    // Convert AM/PM to 24-hour format
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
    if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Remove already booked and locked (normalize times for comparison)
  const [booked, locks] = await Promise.all([
    Appointment.find({
      hospital: hospitalId,
      department: department,
      appointmentDate: dateObj,
      status: { $in: ['pending', 'confirmed'] },
    }).select('appointmentTime'),
    SlotLock.find({
      hospital: hospitalId,
      department: department,
      appointmentDate: dateObj,
      expiresAt: { $gt: new Date() },
    }).select('appointmentTime'),
  ]);

  console.log('📋 Booked appointments:', booked.map(a => a.appointmentTime));
  console.log('🔒 Active locks:', locks.map(l => l.appointmentTime));

  // Convert all stored times (24-hour) to AM/PM format for comparison
  const blockedTimesAMPM = new Set([
    ...booked.map((a) => normalizeTimeToAMPM(a.appointmentTime)),
    ...locks.map((l) => normalizeTimeToAMPM(l.appointmentTime)),
  ]);

  console.log('🚫 Blocked times (AM/PM):', Array.from(blockedTimesAMPM));

  // Filter out blocked slots (baseSlots are in AM/PM format)
  const availableSlots = baseSlots.filter((slot) => !blockedTimesAMPM.has(slot));
  
  console.log('✅ Final available slots:', availableSlots);
  return availableSlots;
};
