const express = require('express');
const { body } = require('express-validator');
const { checkIn, checkOut, myAttendance } = require('../controllers/attendance.controller');
const { authMiddleware, requireRole } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

const locationPayloadValidation = [
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  body('timezone').isString().notEmpty()
];

router.post('/checkin', authMiddleware, requireRole('employee'), locationPayloadValidation, validate, checkIn);
router.post('/checkout', authMiddleware, requireRole('employee'), locationPayloadValidation, validate, checkOut);
router.get('/my', authMiddleware, requireRole('employee'), myAttendance);

module.exports = router;
