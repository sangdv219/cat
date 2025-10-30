import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqContext, RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class RmqService {
    constructor(private readonly configService: ConfigService) { }
    private readonly logger = new Logger(RmqService.name);
    
    getRabbitmqUri(): string {
        try {
            const user = this.configService.get<string>(`RABBITMQ_USER`);
            const password = this.configService.get<string>(`RABBITMQ_PASSWORD`);
            const host = this.configService.get<string>(`RABBITMQ_HOST`);
            const port = parseInt(this.configService.get(`RABBITMQ_PORT`) || '5672');
            const vhost = this.configService.get<string>(`RABBITMQ_VHOST`) || '/';

            if (!host || !port || !user || !password || !vhost) {
                throw new Error(`Missing RMQ configuration for service .env file`);
            }
            const encodeVhost = encodeURIComponent(host);
            const urls = `amqps://${user}:${password}@${host}/${vhost}`;
            this.logger.log(`✅ Connect RabbitMQ successfully with URL: 👉 ${urls}`);
            return urls;
        } catch (error) {
            this.logger.error('🛑 Error getting RabbitMQ URI:', error);
            throw new Error('🛑 Failed to get RabbitMQ URI');
        }
    }

    getOptions(queue: string, noAck = false): RmqOptions {
        const rabbitmqUrl = this.getRabbitmqUri();
        return {
            transport: Transport.RMQ,
            options: {
                urls: [rabbitmqUrl],
                queue,
                noAck,
                persistent: true,
                queueOptions: {
                    durable: true,     // khong mat data khi RabbitMQ restart, save in disk, can save in RAM
                },
            },
        };

    }

    ack(context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        channel.ack(originalMsg);
    }
}