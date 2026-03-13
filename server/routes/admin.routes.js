const express = require('express');
const { body } = require('express-validator');
const { createEmployee, updateOffice, listAttendance } = require('../controllers/admin.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

router.post(
  '/createEmployee',
  authMiddleware,
  requireRole('admin'),
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }), body('timezone').optional().isString()],
  validate,
  createEmployee
);

router.put(
  '/office',
  authMiddleware,
  requireRole('admin'),
  [
    body('officeLatitude').isFloat({ min: -90, max: 90 }),
    body('officeLongitude').isFloat({ min: -180, max: 180 }),
    body('allowedRadiusMeters').isInt({ min: 1 })
  ],
  validate,
  updateOffice
);

router.get('/attendance', authMiddleware, requireRole('admin'), listAttendance);

module.exports = router;
