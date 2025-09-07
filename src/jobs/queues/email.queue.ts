import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class EmailQueueService {
    constructor(@Inject('EMAIL_QUEUE') private readonly emailQueue: Queue) { }

    async addSendMailJob(to: string, otp: number) {
        await this.emailQueue.add(
            'sendMail',
            { to, otp },
            {
                attempts: 3,
                backoff: { type: 'exponential', delay: 500 },
            },
        );
    };
}