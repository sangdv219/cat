// import path from 'path';
import { ConfigService } from '@nestjs/config';
import { Job, Worker } from 'bullmq';

// const processorFile = path.join(__dirname, 'email-processor.js');

const configService = new ConfigService();
export const emailWorker = new Worker(
    'email-queue',
    async (job: Job, token?: string) => {
        console.log('__dirname',__dirname);
// path.join(__dirname, 'email-processor.js')
        // try {
            if (job.name === 'sendMail') {
                const { to, otp } = job.data;
                // await emailService.sendRegistrationEmail(to, otp);
                // console.log(`📧 ---Sending email to--- ${to} with subject: ${otp}`);
                // TODO: gọi service gửi email thật
            }

        // } catch (error) {
        //     console.error(`❌ Job ${job.id} failed: ${error.message}`);
        //     await job.moveToWait(token);
        //     throw new WaitingError();
        // }
    },
    // or
    // __dirname + '/email.processor.ts',
    // connection,
);
// export const emailWorker = new Worker('email-queue', __dirname + '/email-processor.js', workerConfig);
// process.exit(0);
emailWorker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});