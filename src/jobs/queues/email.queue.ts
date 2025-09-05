import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class EmailQueueService {
    constructor(@Inject('EMAIL_QUEUE') private readonly emailQueue: Queue) { }

    async addSendMailJob(to: string, subject: string) {
        await this.emailQueue.add(
            'sendMail',
            { to, subject },
            {
                attempts: 3,
                backoff: { type: 'exponential', delay: 500 },
            },
        );
    }
}