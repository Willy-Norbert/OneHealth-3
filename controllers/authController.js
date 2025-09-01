
const User = require('../models/User');
const { createSendToken } = require('../utils/jwt');
const crypto = require('crypto');
const { sendWelcomeEmail, sendOTPEmail } = require('../services/emailService');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User with this email already exists',
      });
    }

    // Create user in inactive, unverified state
    const newUser = await User.create({
      name,
      email,
      password,
      role: role || 'patient',
      isActive: false,
      isVerified: false,
    });

    // Generate OTP
    const otp = ('' + (crypto.randomInt(100000, 999999))).padStart(6, '0');
    newUser.otpCode = otp;
    newUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await newUser.save({ validateBeforeSave: false });

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
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
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
