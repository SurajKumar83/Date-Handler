const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const nowUTC = () => dayjs().utc().toDate();

const toLocalTimezone = (date, tz) => dayjs(date).tz(tz).format('YYYY-MM-DD HH:mm:ss');

module.exports = { nowUTC, toLocalTimezone };
