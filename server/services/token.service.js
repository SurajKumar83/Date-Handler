const jwt = require('jsonwebtoken');

const signToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      role: user.role,
      timezone: user.timezone,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );

module.exports = { signToken };
