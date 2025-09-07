import { EmailService } from '@/modules/auth/services/mail.service';
import { workerConfig } from '@/shared/bullmq/bullmq.config';
import { Job, WaitingError, Worker } from 'bullmq';

const emailService = new EmailService();
export const emailWorker = new Worker(
    'email-queue',
    async (job: Job, token?: string) => {
        try {
            if (job.name === 'sendMail') {
                const { to, otp } = job.data;
                await emailService.sendRegistrationEmail(to, otp);
                console.log(`📧 Sending email to ${to} with subject: ${otp}`);
                // TODO: gọi service gửi email thật
            }
            
        } catch (error) {
            console.error(`❌ Job ${job.id} failed: ${error.message}`);
            await job.moveToWait(token);
            throw new WaitingError();
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