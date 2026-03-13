const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

router.post(
  '/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  validate,
  register
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, login);

module.exports = router;
