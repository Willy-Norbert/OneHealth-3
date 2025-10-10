
const User = require('../models/User');
const { createSendToken } = require('../utils/jwt');
const crypto = require('crypto');
const { sendWelcomeEmail, sendOTPEmail } = require('../services/emailService');
const { createNotification } = require('../utils/notificationService');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User with this email already exists',
      });
    }

    // Create user in inactive, unverified state
    // Force role to patient on public auth/register endpoint for safety
    const newUser = await User.create({
      name,
      email,
      password,
      role: 'patient',
      isActive: false,
      isVerified: false,
    });

    // Generate OTP
    const otp = ('' + (crypto.randomInt(100000, 999999))).padStart(6, '0');
    newUser.otpCode = otp;
    newUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await newUser.save({ validateBeforeSave: false });

    // Dev-only visibility for verification code (never log passwords)
    if (process.env.NODE_ENV !== 'production') {
      const maskEmail = (em) => em.replace(/(^.).+(@.*$)/, (m, a, b) => a + '***' + b);
      console.log(`[DEV] Registered user:`, { id: newUser._id.toString(), email: maskEmail(newUser.email), role: newUser.role });
      console.log(`[DEV] Email verification OTP: ${otp} (expires in 10m)`);
    }

    // Send emails
    try {
      await sendWelcomeEmail(newUser);
      await sendOTPEmail(newUser, otp, 'Account Verification');
    } catch (e) {
      // continue even if email fails, but inform client
      console.error('Email send error:', e.message);
    }

    res.status(201).json({
      status: 'success',
      message: 'Registration successful. Verification code sent to email.',
      data: { userId: newUser._id, email: newUser.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message || 'Registration failed',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!',
      });
      console.log('Login attempt with missing credentials');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password ? 'Provided' : 'Not Provided'}`);
      console.log(`Request Body: ${JSON.stringify(req.body)}`);
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }
    console.log(`User ${user.email} logged in successfully`);
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'fail',
        message: user.otpCode ? 'Account not verified. Please confirm the OTP sent to your email.' : 'Your account is not active. Please contact support.',
      });
    }

    
    // Fire a welcome email/notification only on first login to dashboard
    try {
      if (!user.firstLoginWelcomedAt) {
        await createNotification({ recipient: user._id, sender: user._id, type: 'user', message: `Welcome to OneHealth, ${user.name || 'User'}!`, relatedEntity: { id: user._id, type: 'User' } });
        try { await sendWelcomeEmail(user); } catch {}
        user.firstLoginWelcomedAt = new Date();
        await user.save({ validateBeforeSave: false });
      }
    } catch {}
    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      status: 'fail',
      message: 'Login failed',
    });
  }
};

const logout = (req, res) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: false,
  });
  res.status(200).json({ status: 'success' });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to get user data',
    });
  }
};

// OTP verification
const verifyOTP = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.otpCode || !user.otpExpires) {
      return res.status(400).json({ status: 'fail', message: 'Invalid or expired code' });
    }
    if (user.otpCode !== code || user.otpExpires < new Date()) {
      return res.status(400).json({ status: 'fail', message: 'Invalid or expired code' });
    }
    user.isActive = true;
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message || 'Verification failed' });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

    const otp = ('' + (crypto.randomInt(100000, 999999))).padStart(6, '0');
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    try { await sendOTPEmail(user, otp, 'Account Verification'); } catch {}
    res.status(200).json({ status: 'success', message: 'OTP sent' });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message || 'Failed to resend code' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

    const code = ('' + (crypto.randomInt(100000, 999999))).padStart(6, '0');
    user.passwordResetOTP = code;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    try { await sendOTPEmail(user, code, 'Password Reset'); } catch {}
    res.status(200).json({ status: 'success', message: 'Password reset code sent' });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message || 'Failed to initiate reset' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.passwordResetOTP || !user.passwordResetExpires) {
      return res.status(400).json({ status: 'fail', message: 'Invalid or expired code' });
    }
    if (user.passwordResetOTP !== code || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ status: 'fail', message: 'Invalid or expired code' });
    }

    user.password = newPassword;
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message || 'Failed to reset password' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
};

// --- Social logins (Google / Facebook) ---
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

async function findOrCreateSocialUser(profile) {
  const email = (profile.email || `${profile.provider}_${profile.id}@social.local`).toLowerCase();
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: profile.name || email.split('@')[0],
      email,
      profileImage: profile.picture,
      role: 'patient',
      isActive: true,
      isVerified: true,
    });
  }
  return user;
}

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ success: false, message: 'Missing idToken' });
    const gRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const g = await gRes.json();
    if (!g || g.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ success: false, message: 'Invalid Google token' });
    }
    const user = await findOrCreateSocialUser({
      id: g.sub,
      email: g.email,
      name: g.name,
      picture: g.picture,
      provider: 'google'
    });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ success: true, data: { token, user } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Google login failed', data: { error: e.message } });
  }
};

const facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ success: false, message: 'Missing accessToken' });
    const fbRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`);
    const fb = await fbRes.json();
    if (!fb || !fb.id) return res.status(401).json({ success: false, message: 'Invalid Facebook token' });
    const user = await findOrCreateSocialUser({
      id: fb.id,
      email: fb.email,
      name: fb.name,
      picture: fb?.picture?.data?.url,
      provider: 'facebook'
    });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ success: true, data: { token, user } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Facebook login failed', data: { error: e.message } });
  }
};

module.exports.googleLogin = googleLogin;
module.exports.facebookLogin = facebookLogin;
