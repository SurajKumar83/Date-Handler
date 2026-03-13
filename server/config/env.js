const path = require('path');
const dotenv = require('dotenv');

let loaded = false;

const loadEnv = () => {
  if (loaded) return;

  const candidates = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../../.env.local'),
    path.resolve(process.cwd(), '.env')
  ];

  for (const envPath of candidates) {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
      // Don't throw here — we want to allow missing .env files
      continue;
    }
    if (result.parsed && Object.keys(result.parsed).length > 0) {
      console.log('Loaded .env from:', envPath);
    }
  }

  loaded = true;
};

module.exports = { loadEnv };
