const { loadEnv } = require('./config/env');
const app = require('./app');
const connectDB = require('./config/db');

loadEnv();

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
