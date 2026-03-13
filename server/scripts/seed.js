require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const OfficeConfig = require('../models/OfficeConfig');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = 'admin@attendance.local';
    const adminPassword = await bcrypt.hash('Admin@123', 10);

    await User.updateOne(
      { email: adminEmail },
      {
        $set: {
          name: 'Default Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
          timezone: 'UTC'
        }
      },
      { upsert: true }
    );

    await OfficeConfig.findOneAndUpdate(
      {},
      {
        officeLatitude: 28.6139,
        officeLongitude: 77.209,
        allowedRadiusMeters: 300
      },
      { upsert: true }
    );

    console.log('Seed completed');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
