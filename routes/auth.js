import express from 'express';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

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

export default router;
