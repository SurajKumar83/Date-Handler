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
    dotenv.config({ path: envPath });
  }

  loaded = true;
};

module.exports = { loadEnv };
