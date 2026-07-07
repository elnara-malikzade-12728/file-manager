const express = require('express');
const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');

const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const router = express.Router();

router.get('/connect', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const encoded = authHeader.split(' ')[1];
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const [email, password] = decoded.split(':');

  const user = await dbClient.usersCollection().findOne({
    email,
    password: sha1(password),
  });

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = uuidv4();

  await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);

  return res.status(200).json({ token });
});

module.exports = router;
