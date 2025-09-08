const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllUsers,
  getUser,
  updateUserRole,
  updateUserProfile,
  deleteUser,
  getPatients
} = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management operations
 * 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f8b2c8e1234567890abcde"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         role:
 *           type: string
 *           enum: [patient, doctor, admin, hospital]
 *           example: "patient"
 *         isActive:
 *           type: boolean
 *           example: true
 *         isVerified:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-09-06T10:00:00Z"
 *     UpdateRoleRequest:
 *       type: object
 *       required: [role]
 *       properties:
 *         role:
 *           type: string
 *           enum: [patient, doctor, admin, hospital]
 *           example: "doctor"
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "John Smith"
 *         email:
 *           type: string
 *           example: "johnsmith@example.com"
 *         phone:
 *           type: string
 *           example: "+250788123456"
 *         avatar:
 *           type: string
 *           example: "https://example.com/avatar.jpg"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [patient, doctor, admin, hospital]
 *         description: Filter by role
 *       - in: query
 *         name: hospitalId
 *         schema:
 *           type: string
 *         description: Filter by hospital ID
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Users retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalUsers:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user details (Admin or user themselves)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     additionalInfo:
 *                       type: object
 *                       description: Doctor or Hospital info if applicable
 *       404:
 *         description: User not found
 *       403:
 *         description: Not authorized to view this user
 */

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     summary: Update user role (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleRequest'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid role specified
 *       404:
 *         description: User not found
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/users/{id}/profile:
 *   put:
 *     summary: Update user profile (User themselves only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Email already exists or validation error
 *       403:
 *         description: Can only update your own profile
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deactivate user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Admin access required
 */

// Protect all routes
router.use(protect);

// User management routes
router.get('/', restrictTo('admin','hospital'), getAllUsers);
router.get('/patients', restrictTo('hospital','admin'), getPatients);
router.get('/me', getUser); // Get current user profile
router.get('/:id', getUser); // Admin or user themselves
router.put('/:id/role', restrictTo('admin','hospital'), updateUserRole);
router.put('/:id/profile', updateUserProfile); // User themselves only
router.patch('/profile', updateUserProfile); // Update current user profile
router.delete('/:id', restrictTo('admin','hospital'), deleteUser);

module.exports = router;