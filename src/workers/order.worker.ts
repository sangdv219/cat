import { connection } from '@/shared/bullmq/bullmq.config';
import { Worker } from 'bullmq';
import * as path from 'path';

const dev = path.resolve(__dirname, '../../dist/processors/order-processor.js');
const fileBuild = path.resolve(__dirname, '../processors/order-processor.js');
console.log("fileBuild: ", fileBuild);

export const orderWorker = new Worker('order-queue', dev, connection);

orderWorker.on('completed', (job, result) => {
    console.log(`🎉 Job ${job.id} completed! Result:`, result);
    console.log(`✅ Job ${job.id} completed`);
});

orderWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});