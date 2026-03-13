const Attendance = require('../models/Attendance');
const OfficeConfig = require('../models/OfficeConfig');
const { haversineDistanceMeters } = require('../utils/distance.util');
const { nowUTC, toLocalTimezone } = require('../utils/timezone.util');

const validateWithinOfficeRadius = async (latitude, longitude) => {
  const officeConfig = await OfficeConfig.findOne().sort({ updatedAt: -1 });

  if (!officeConfig) {
    return { allowed: false, reason: 'Office configuration is missing' };
  }

  const distance = haversineDistanceMeters(
    latitude,
    longitude,
    officeConfig.officeLatitude,
    officeConfig.officeLongitude
  );

  return {
    allowed: distance <= officeConfig.allowedRadiusMeters,
    reason: `Distance from office: ${Math.round(distance)} meters`,
    officeConfig
  };
};

const checkIn = async (req, res, next) => {
  try {
    const { latitude, longitude, timezone } = req.body;
    const employeeId = req.user.userId;

    const openAttendance = await Attendance.findOne({ employeeId, checkOutUTC: null }).sort({ createdAt: -1 });
    if (openAttendance) {
      return res.status(409).json({ message: 'Already checked in. Please checkout first.' });
    }

    const locationValidation = await validateWithinOfficeRadius(latitude, longitude);
    if (!locationValidation.allowed) {
      return res.status(403).json({ message: `Check-in denied. ${locationValidation.reason}` });
    }

    const attendance = await Attendance.create({
      employeeId,
      checkInUTC: nowUTC(),
      checkInLocation: { latitude, longitude },
      timezone
    });

    return res.status(201).json({
      message: 'Check-in successful',
      attendanceId: attendance._id,
      checkInUTC: attendance.checkInUTC,
      checkInLocal: toLocalTimezone(attendance.checkInUTC, timezone)
    });
  } catch (error) {
    return next(error);
  }
};

const checkOut = async (req, res, next) => {
  try {
    const { latitude, longitude, timezone } = req.body;
    const employeeId = req.user.userId;

    const attendance = await Attendance.findOne({ employeeId, checkOutUTC: null }).sort({ createdAt: -1 });
    if (!attendance) {
      return res.status(409).json({ message: 'No active check-in found.' });
    }

    const locationValidation = await validateWithinOfficeRadius(latitude, longitude);
    if (!locationValidation.allowed) {
      return res.status(403).json({ message: `Check-out denied. ${locationValidation.reason}` });
    }

    attendance.checkOutUTC = nowUTC();
    attendance.checkOutLocation = { latitude, longitude };
    attendance.timezone = timezone;
    await attendance.save();

    return res.json({
      message: 'Check-out successful',
      checkOutUTC: attendance.checkOutUTC,
      checkOutLocal: toLocalTimezone(attendance.checkOutUTC, timezone)
    });
  } catch (error) {
    return next(error);
  }
};

const myAttendance = async (req, res, next) => {
  try {
    const timezone = req.query.timezone || req.user.timezone || 'UTC';
    const records = await Attendance.find({ employeeId: req.user.userId }).sort({ createdAt: -1 }).limit(30);

    const formatted = records.map((record) => ({
      id: record._id,
      checkInUTC: record.checkInUTC,
      checkOutUTC: record.checkOutUTC,
      checkInLocal: toLocalTimezone(record.checkInUTC, timezone),
      checkOutLocal: record.checkOutUTC ? toLocalTimezone(record.checkOutUTC, timezone) : null,
      checkInLocation: record.checkInLocation,
      checkOutLocation: record.checkOutLocation
    }));

    return res.json(formatted);
  } catch (error) {
    return next(error);
  }
};

module.exports = { checkIn, checkOut, myAttendance };
