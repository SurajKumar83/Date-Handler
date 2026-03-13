const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../services/token.service');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'employee', timezone = 'UTC' } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role, timezone });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        timezone: user.timezone
      }
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        timezone: user.timezone
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login };
