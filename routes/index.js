const express = require('express');

const usersRoutes = require('./users');
const authRoutes = require('./auth');
const dropsRoutes = require('./drops');

const router = express.Router();

router.use(usersRoutes);
router.use(authRoutes);
router.use(dropsRoutes);

module.exports = router;
