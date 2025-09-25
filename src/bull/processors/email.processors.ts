// src/bull/processors/order.processor.ts
import { EmailService } from '@/modules/auth/services/mail.service';
import { Process, Processor } from '@nestjs/bull';
import { HttpException, Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('email-queue')
export class EmailProsessor {
    private readonly logger = new Logger(EmailProsessor.name);
    constructor(
        private readonly emailService: EmailService
    ) { }
    @Process('send-email') // name job
    async handleSendEmail(job: Job, token?: string) {
        const {email, otp} = job.data
        try {
            await this.emailService.sendRegistrationEmail(email, otp)
            this.logger.log("✅ Email success:");

            return { status: 'ok' };
        } catch (error) {
            this.logger.error(`❌ Job ${job.id} failed (attempt ${job.attemptsMade + 1}):`, error.message);
            if (error instanceof HttpException) {
                const status = error.getStatus();
                const response = error.getResponse();
                this.logger.error(`Order failed: ${status} - ${JSON.stringify(response)}`);
                throw error; // vẫn throw để Bull đánh dấu job failed
            }
            throw new Error('Worker internal error');
        }
    }
}