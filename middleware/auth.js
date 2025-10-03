
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

const protect = async (req, res, next) => {
  try {
    // Get token from header or cookie
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      // console.log('Token from header:', token);
    } else if (req.cookies.token) {
      token = req.cookies.token;
      // console.log('Token from cookie:', token);
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt; // Fallback for backward compatibility
      // console.log('Token from jwt cookie:', token);
    }

    if (!token) {
      // console.log('No token found.');
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    // console.log('Decoded token payload:', decoded);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    // console.log('Current user from DB:', currentUser);
    if (!currentUser) {
      // console.log('User not found for token ID:', decoded.id);
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.',
      });
    }

    // Check if user is active
    if (!currentUser.isActive) {
      // console.log('User account is not active:', currentUser.email);
      return res.status(401).json({
        status: 'fail',
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    // console.log('req.user populated:', req.user.email, 'Role:', req.user.role, 'Hospital:', req.user.hospital);
    next();
  } catch (error) {
    // console.error('Error in protect middleware:', error.message);
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again!',
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(`RestrictTo: User role: ${req.user?.role}, Allowed roles: ${roles.join(', ')}`);
    if (!roles.includes(req.user.role)) {
      console.log(`RestrictTo: Access DENIED for role ${req.user?.role}`);
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    console.log(`RestrictTo: Access GRANTED for role ${req.user?.role}`);
    next();
  };
};

module.exports = { protect, restrictTo };
