const nodemailer = require('nodemailer');

// Create transporter from environment variables
// Expected env vars:
// SMTP_HOST, SMTP_PORT, SMTP_SECURE (true/false), SMTP_USER, SMTP_PASS, SMTP_FROM
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('Email transport is not configured. Please set SMTP_HOST, SMTP_USER, SMTP_PASS');
  }

  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

let transporter;
function getTransporter() {
  if (!transporter) transporter = createTransporter();
  return transporter;
}

async function sendEmail({ to, subject, html, text }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const info = await getTransporter().sendMail({ from, to, subject, html, text });
  return info;
}

// Templates
function baseTemplate(title, body) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
    <div style="background:#0ea5e9; color:#fff; padding:16px 20px; border-radius:12px 12px 0 0;">
      <h2 style="margin:0;">${title}</h2>
    </div>
    <div style="background:#f8fafc; padding:20px; border:1px solid #e2e8f0; border-top:0; border-radius:0 0 12px 12px;">
      ${body}
      <p style="color:#64748b; font-size:12px; margin-top:24px;">This is an automated message. Please do not reply.</p>
    </div>
  </div>`;
}

async function sendWelcomeEmail(user) {
  const html = baseTemplate('Welcome to ONE HEALTHLINE CONNECT', `
    <p>Hi ${user.name || user.fullName || 'there'},</p>
    <p>Welcome aboard! Your account has been created successfully.</p>
  `);
  return sendEmail({ to: user.email, subject: 'Welcome to ONE HEALTHLINE CONNECT', html });
}

async function sendOTPEmail(user, code, purpose = 'Account Verification') {
  const html = baseTemplate(`${purpose} Code`, `
    <p>Hi ${user.name || user.fullName || 'there'},</p>
    <p>Your one-time code is:</p>
    <div style="font-size:28px; font-weight:700; letter-spacing:4px; color:#0ea5e9;">${code}</div>
    <p>This code expires in 10 minutes.</p>
  `);
  return sendEmail({ to: user.email, subject: `${purpose} Code`, html });
}

async function sendAppointmentEmail(type, appointment, patient) {
  const title = type === 'confirmation' ? 'Appointment Confirmed' : 'Appointment Update';
  const html = baseTemplate(title, `
    <p>Dear ${appointment?.patientDetails?.fullName || patient?.name || 'Patient'},</p>
    <p>Your appointment details:</p>
    <ul>
      <li><strong>ID:</strong> ${appointment._id}</li>
      <li><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleString()}</li>
      <li><strong>Department:</strong> ${appointment.department}</li>
      <li><strong>Type:</strong> ${appointment.appointmentType}</li>
    </ul>
  `);
  return sendEmail({ to: patient.email, subject: `Appointment ${type === 'confirmation' ? 'Confirmation' : 'Update'}`, html });
}

async function sendOrderStatusEmail(order, statusOverride) {
  const status = statusOverride || order.status;
  const html = baseTemplate('Order Status Update', `
    <p>Hello ${order?.patient?.fullName || 'Customer'},</p>
    <p>Your pharmacy order <strong>#${order._id}</strong> is now <strong>${status}</strong>.</p>
  `);
  const to = order?.patient?.email || order?.patientEmail;
  if (!to) return;
  return sendEmail({ to, subject: `Your order is ${status}`, html });
}

async function sendEmergencyStatusEmail(emergency, statusOverride) {
  const status = statusOverride || emergency.status;
  const html = baseTemplate('Emergency Update', `
    <p>Emergency <strong>#${emergency._id}</strong> status: <strong>${status}</strong>.</p>
  `);
  const to = emergency?.patient?.email;
  if (!to) return;
  return sendEmail({ to, subject: `Emergency ${status}`, html });
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOTPEmail,
  sendAppointmentEmail,
  sendOrderStatusEmail,
  sendEmergencyStatusEmail,
};
