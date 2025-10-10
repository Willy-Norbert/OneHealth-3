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

  // Use pooled transporter for better performance and connection reuse in prod
  // Add conservative timeouts to avoid blocking requests when SMTP is unreachable
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    pool: true,
    maxConnections: parseInt(process.env.SMTP_MAX_CONNECTIONS || '3', 10),
    maxMessages: parseInt(process.env.SMTP_MAX_MESSAGES || '100', 10),
    rateDelta: 1000,
    rateLimit: parseInt(process.env.SMTP_RATE_LIMIT || '5', 10),
    connectionTimeout: parseInt(process.env.SMTP_CONNECTION_TIMEOUT || '5000', 10), // 5s
    greetingTimeout: parseInt(process.env.SMTP_GREETING_TIMEOUT || '5000', 10), // 5s
    socketTimeout: parseInt(process.env.SMTP_SOCKET_TIMEOUT || '10000', 10), // 10s
  });
}

let transporter;
function getTransporter() {
  if (!transporter) transporter = createTransporter();
  return transporter;
}

async function sendEmail({ to, subject, html, text }) {
  if (String(process.env.EMAIL_DISABLED || 'false').toLowerCase() === 'true') {
    return { disabled: true };
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const transporter = getTransporter();
  const timeoutMs = parseInt(process.env.EMAIL_SEND_TIMEOUT_MS || '8000', 10); // 8s
  const sendPromise = transporter.sendMail({ from, to, subject, html, text });
  // Fail fast if SMTP is slow/unreachable to avoid blocking API responses
  const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ timedOut: true }), timeoutMs));
  try {
    const result = await Promise.race([sendPromise, timeoutPromise]);
    return result;
  } catch (e) {
    // Swallow SMTP errors to avoid crashing requests; log upstream callers can handle
    try { console.warn('Email send failed:', e?.message || e); } catch {}
    return { error: true, message: e?.message || 'send failed' };
  }
}

// Templates
function baseTemplate(title, body) {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 640px; margin: 0 auto; background-color: #f4f6f8; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
      <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0ea5e9; padding: 20px; text-align: center;">
          <img src="https://onehealth-ebon.vercel.app/irabaruta-logo.png" alt="Logo" style="max-width: 150px; margin-bottom: 10px;"/>
          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">${title}</h1>
        </div>
        <div style="padding: 30px 20px; line-height: 1.6; color: #333333;">
          ${body}
        </div>
        <div style="background-color: #f4f6f8; padding: 20px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0;">© ${new Date().getFullYear()} One Healthline Connect. All rights reserved.</p>
          <p style="margin: 5px 0 0;">This is an automated message. Please do not reply.</p>
        </div>
      </div>
    </div>`;
  }

async function sendWelcomeEmail(user, hospitalName, password) {
  const html = baseTemplate('Welcome to ONE HEALTHLINE CONNECT', `
    <p>Hi ${user.name || user.fullName || 'there'},</p>
    <p>Welcome aboard! Your account has been created successfully at ${hospitalName}.</p>
    <p>Here are your login credentials:</p>
    <ul>
      <li><strong>Email:</strong> ${user.email}</li>
      <li><strong>Password:</strong> ${password}</li>
    </ul>
    <p>Please keep this information secure.</p>
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

async function sendDoctorBookingEmail(appointment, doctorUser) {
  const title = 'New Appointment Booked';
  const html = baseTemplate(title, `
    <p>Dear Dr. ${doctorUser?.name || 'Doctor'},</p>
    <p>A new appointment has been booked with you.</p>
    <ul>
      <li><strong>Appointment ID:</strong> ${appointment._id}</li>
      <li><strong>Date/Time:</strong> ${new Date(appointment.appointmentDate).toLocaleString()}</li>
      <li><strong>Patient:</strong> ${appointment?.patientDetails?.fullName || ''}</li>
      <li><strong>Type:</strong> ${appointment.appointmentType}</li>
    </ul>
  `);
  if (!doctorUser?.email) return;
  return sendEmail({ to: doctorUser.email, subject: 'New appointment booked', html });
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

async function sendRoleChangeEmail(user, oldRole, newRole) {
  const html = baseTemplate('Role Update Notification', `
    <p>Dear ${user.name},</p>
    <p>Your account role has been updated by our administrators.</p>
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0;"><strong>Previous Role:</strong> ${oldRole.charAt(0).toUpperCase() + oldRole.slice(1)}</p>
      <p style="margin: 0;"><strong>New Role:</strong> ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}</p>
    </div>
    <p>This change may affect your access permissions within the system. Please log in to your account to see the updated features available to you.</p>
    <p>If you have any questions about this change, please contact our support team.</p>
  `);
  return sendEmail({ to: user.email, subject: 'Your Account Role Has Been Updated', html });
}

async function sendHospitalApprovalEmail(user, hospital, isApproved) {
  const title = isApproved ? 'Hospital Application Approved!' : 'Hospital Application Update';
  const body = isApproved ? `
    <p>Dear ${user.name},</p>
    <p>We're excited to inform you that your hospital registration for <strong>${hospital.name}</strong> has been approved!</p>
    <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #059669; margin-top: 0;">What's Next?</h3>
      <ul>
        <li>Your hospital is now visible to patients and doctors</li>
        <li>You can manage your departments and staff</li>
        <li>Patients can book appointments at your facility</li>
        <li>You have access to hospital management features</li>
      </ul>
    </div>
    <p>Thank you for joining the One Healthline Connect network. We look forward to serving patients together!</p>
  ` : `
    <p>Dear ${user.name},</p>
    <p>Thank you for your interest in joining One Healthline Connect. After careful review, we need additional information before we can approve your hospital registration for <strong>${hospital.name}</strong>.</p>
    <div style="background: #fef2f2; border: 1px solid #f87171; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0;">Please contact our support team for more details about the requirements for hospital registration.</p>
    </div>
    <p>We appreciate your understanding and look forward to working with you.</p>
  `;
  
  const html = baseTemplate(title, body);
  return sendEmail({ to: user.email, subject: title, html });
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOTPEmail,
  sendAppointmentEmail,
  sendDoctorBookingEmail,
  sendOrderStatusEmail,
  sendEmergencyStatusEmail,
  sendRoleChangeEmail,
  sendHospitalApprovalEmail,
  baseTemplate,
};
