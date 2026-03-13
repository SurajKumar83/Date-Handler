const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const OfficeConfig = require('../models/OfficeConfig');
const { loadEnv } = require('../config/env');

loadEnv();

(async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (typeof mongoUri !== 'string' || !mongoUri.trim()) {
      throw new Error(
        `MONGO_URI is missing. Create ${path.resolve(__dirname, '../../.env')} and set MONGO_URI.`
      );
    }

    await mongoose.connect(mongoUri);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

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
    console.error(error.message);
    process.exit(1);
  }
})();
