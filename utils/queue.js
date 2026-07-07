const Queue = require('bull');

const dropQueue = new Queue('dropQueue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

module.exports = dropQueue;