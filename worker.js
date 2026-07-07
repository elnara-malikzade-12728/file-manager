import dropQueue from './utils/queue.js';

dropQueue.process(async (job) => {
  console.log('Processing drop job:', job.data);
});