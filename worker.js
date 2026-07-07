const dropQueue = require('./utils/queue');

dropQueue.process(async (job) => {
  console.log('Processing drop job:', job.data);
});