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
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) throw new Error('Hospital not found');

  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) throw new Error('Invalid date');

  // Try external first
  let baseSlots = [];
  if (hospital.externalApiUrl) {
    baseSlots = await fetchExternalSlots(hospital.externalApiUrl, { date, department });
  }

  // Fallback to local working hours
  if (!baseSlots || baseSlots.length === 0) {
    const day = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const wh = hospital.workingHours?.[day];
    baseSlots = generateSlotsFromWorkingHours(wh);
  }

  // Remove already booked and locked
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

  const blockedTimes = new Set([
    ...booked.map((a) => a.appointmentTime),
    ...locks.map((l) => l.appointmentTime),
  ]);

  const availableSlots = baseSlots.filter((s) => !blockedTimes.has(s));
  return availableSlots;
};
