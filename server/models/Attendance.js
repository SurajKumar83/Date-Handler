const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    checkInUTC: { type: Date, required: true },
    checkOutUTC: { type: Date, default: null },
    checkInLocation: { type: locationSchema, required: true },
    checkOutLocation: { type: locationSchema, default: null },
    timezone: { type: String, required: true }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
