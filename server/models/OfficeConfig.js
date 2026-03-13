const mongoose = require('mongoose');

const officeConfigSchema = new mongoose.Schema(
  {
    officeLatitude: { type: Number, required: true },
    officeLongitude: { type: Number, required: true },
    allowedRadiusMeters: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('OfficeConfig', officeConfigSchema);
