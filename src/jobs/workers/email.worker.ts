import { EmailService } from '@/modules/auth/services/mail.service';
import { workerConfig } from '@/shared/bullmq/bullmq.config';
import { Job, Worker } from 'bullmq';

const emailService = new EmailService();
export const emailWorker = new Worker(
    'email-queue',
    async (job: Job) => {
        if (job.name === 'sendMail') {
            const { to, otp } = job.data;
            await emailService.sendRegistrationEmail(to, otp);
            console.log(`📧 Sending email to ${job.data.to} with subject: ${job.data.subject}`);
            // TODO: gọi service gửi email thật
        }
    },
    workerConfig,
);

emailWorker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});