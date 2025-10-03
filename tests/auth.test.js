const request = require('supertest');
const app = require('../server');
const { testUtils } = require('./setup');

describe('Authentication Endpoints', () => {
  describe('POST /auth/register', () => {
    it('should register a new patient successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        role: 'patient'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.role).toBe('patient');
      expect(response.body.data.token).toBeDefined();
    });

    it('should register a new hospital successfully', async () => {
      const hospitalData = {
        name: 'Test Hospital',
        location: 'Test City',
        address: '123 Test Street',
        contact: {
          phone: '+1234567890',
          email: 'hospital@test.com'
        },
        services: ['General Medicine'],
        workingHours: {
          monday: { start: '08:00', end: '17:00' },
          tuesday: { start: '08:00', end: '17:00' },
          wednesday: { start: '08:00', end: '17:00' },
          thursday: { start: '08:00', end: '17:00' },
          friday: { start: '08:00', end: '17:00' },
          saturday: { start: '08:00', end: '12:00' },
          sunday: { start: '08:00', end: '12:00' }
        }
      };

      const userData = {
        name: 'Hospital Admin',
        email: 'admin@hospital.com',
        password: 'SecurePass123!',
        role: 'hospital',
        hospitalData
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user.role).toBe('hospital');
    });

    it('should fail with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass123!',
        role: 'patient'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.status).toBe('error');
    });

    it('should fail with weak password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
        role: 'patient'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.status).toBe('error');
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        role: 'patient'
      };

      // Register first user
      await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await testUtils.createTestUser({
        email: 'test@example.com',
        password: 'TestPassword123!'
      });
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should fail with invalid email', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.status).toBe('error');
    });

    it('should fail with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123!'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.status).toBe('error');
    });

    it('should fail with inactive user', async () => {
      await testUtils.createTestUser({
        email: 'inactive@example.com',
        password: 'TestPassword123!',
        isActive: false
      });

      const loginData = {
        email: 'inactive@example.com',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /auth/forgot-password', () => {
    beforeEach(async () => {
      await testUtils.createTestUser({
        email: 'test@example.com'
      });
    });

    it('should send password reset email for valid user', async () => {
      const response = await request(app)
        .post('/auth/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body.status).toBe('success');
    });

    it('should not reveal if email does not exist', async () => {
      const response = await request(app)
        .post('/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);

      expect(response.body.status).toBe('success');
    });
  });

  describe('POST /auth/reset-password', () => {
    let user;
    let resetToken;

    beforeEach(async () => {
      user = await testUtils.createTestUser({
        email: 'test@example.com'
      });
      
      // Generate reset token (simplified for testing)
      const crypto = require('crypto');
      resetToken = crypto.randomBytes(32).toString('hex');
      
      user.passwordResetOTP = resetToken;
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
    });

    it('should reset password successfully with valid token', async () => {
      const response = await request(app)
        .post('/auth/reset-password')
        .send({
          token: resetToken,
          password: 'NewPassword123!'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .post('/auth/reset-password')
        .send({
          token: 'invalid-token',
          password: 'NewPassword123!'
        })
        .expect(400);

      expect(response.body.status).toBe('error');
    });

    it('should fail with expired token', async () => {
      // Set token as expired
      user.passwordResetExpires = Date.now() - 1000;
      await user.save();

      const response = await request(app)
        .post('/auth/reset-password')
        .send({
          token: resetToken,
          password: 'NewPassword123!'
        })
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });
});


