import { EmailService } from '@/modules/auth/services/mail.service';
import { SandboxedJob, WaitingError } from 'bullmq';

const emailService = new EmailService();
export default async function (job: SandboxedJob) {
    console.log(`📧 [Sandbox] Sending email to ${job.data.to}, subject: ${job.data.subject}`);
    try {
        if (job.name === 'sendMail') {
            const { to, otp } = job.data;
            await emailService.sendRegistrationEmail(to, otp);
        }

    } catch (error) {
        console.error(`❌ Job ${job.id} failed: ${error.message}`);
        // await job.moveToWait(token);
        throw new WaitingError();
    }
};