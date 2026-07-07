const express = require('express');
const { v4: uuidv4 } = require('uuid');

const redisClient = require('../utils/redis');
const dropQueue = require('../utils/queue');

const router = express.Router();

async function getUserIdFromToken(req) {
  const token = req.headers['x-token'];

  if (!token) {
    return null;
  }

  return redisClient.get(`auth_${token}`);
}

router.post('/drops', async (req, res) => {
  const userId = await getUserIdFromToken(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  const readToken = uuidv4();

  await redisClient.set(
    `drop_${readToken}`,
    JSON.stringify({ message, userId }),
    10 * 60,
  );

  await dropQueue.add({
    readToken,
    userId,
    createdAt: new Date(),
  });

  return res.status(201).json({
    readToken,
    readOnce: true,
  });
});

router.get('/drops/:token', async (req, res) => {
  const { token } = req.params;
  const key = `drop_${token}`;

  const data = await redisClient.get(key);

  if (!data) {
    return res.status(410).json({ error: 'Gone' });
  }

  await redisClient.del(key);

  const drop = JSON.parse(data);

  return res.status(200).json({
    message: drop.message,
  });
});

module.exports = router;
