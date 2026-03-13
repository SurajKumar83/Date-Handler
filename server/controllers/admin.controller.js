const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const OfficeConfig = require('../models/OfficeConfig');

const createEmployee = async (req, res, next) => {
  try {
    const { name, email, password, timezone = 'UTC' } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: 'Employee email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const employee = await User.create({ name, email, password: hash, role: 'employee', timezone });

    return res.status(201).json({
      message: 'Employee created',
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        timezone: employee.timezone
      }
    });
  } catch (error) {
    return next(error);
  }
};

const updateOffice = async (req, res, next) => {
  try {
    const { officeLatitude, officeLongitude, allowedRadiusMeters } = req.body;

    const config = await OfficeConfig.findOneAndUpdate(
      {},
      { officeLatitude, officeLongitude, allowedRadiusMeters },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ message: 'Office configuration updated', config });
  } catch (error) {
    return next(error);
  }
};

const listAttendance = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Attendance.find()
        .populate('employeeId', 'name email timezone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Attendance.countDocuments()
    ]);

    return res.json({
      page,
      limit,
      total,
      records
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createEmployee, updateOffice, listAttendance };
