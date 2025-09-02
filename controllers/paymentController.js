const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');
const devFake = require('../services/payments/devFake');
const mtn = require('../services/payments/mtn');
const irembo = require('../services/payments/irembo');
const Joi = require('joi');

const PROVIDERS = { DEV_FAKE: devFake, MTN: mtn, IREMBO: irembo };

const createCheckoutSchema = Joi.object({
  appointmentId: Joi.string().required(),
  provider: Joi.string().valid('DEV_FAKE', 'MTN', 'IREMBO').required(),
});

exports.createCheckout = async (req, res) => {
  try {
    const { error, value } = createCheckoutSchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.message });

    const { appointmentId, provider } = value;
    const appointment = await Appointment.findById(appointmentId).populate('hospital');
    if (!appointment) return res.status(404).json({ status: 'error', message: 'Appointment not found' });

    // Only allow paying once
    if (appointment.paymentStatus === 'paid') {
      return res.status(400).json({ status: 'error', message: 'Appointment already paid' });
    }

    const amount = appointment.consultationFee;
    const platformFee = Math.round(amount * 0.01);
    const hospitalAmount = amount - platformFee;

    const providerSvc = PROVIDERS[provider];
    if (!providerSvc) return res.status(400).json({ status: 'error', message: 'Unsupported provider' });

    const reference = `${appointment._id}_${Date.now()}`;
    const session = await providerSvc.createCheckoutSession({ amount, currency: 'RWF', reference });

    const payment = await Payment.create({
      appointment: appointment._id,
      hospital: appointment.hospital._id,
      patient: appointment.patient,
      provider,
      amount,
      status: session.status || 'REQUIRES_ACTION',
      split: { platformFee, hospitalAmount },
      providerSessionId: session.providerSessionId,
      checkoutUrl: session.checkoutUrl,
      providerMetadata: session.metadata,
    });

    return res.status(201).json({
      status: 'success',
      data: { payment },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

const verifySchema = Joi.object({ paymentId: Joi.string().required() });

exports.verifyPayment = async (req, res) => {
  try {
    const { error, value } = verifySchema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.message });

    const { paymentId } = value;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ status: 'error', message: 'Payment not found' });

    const providerSvc = PROVIDERS[payment.provider];
    const result = await providerSvc.verifyPayment({ providerSessionId: payment.providerSessionId });

    let newStatus = result.status || 'PROCESSING';
    payment.status = newStatus;
    await payment.save();

    if (newStatus === 'SUCCEEDED') {
      const appt = await Appointment.findById(payment.appointment);
      if (appt) {
        appt.paymentStatus = 'paid';
        if (appt.status === 'pending') appt.status = 'confirmed';
        await appt.save();
      }
    }

    return res.status(200).json({ status: 'success', data: { payment } });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ status: 'error', message: 'Payment not found' });
    return res.status(200).json({ status: 'success', data: { payment } });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
