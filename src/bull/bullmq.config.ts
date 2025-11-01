import { BullModule as NestBullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'] }),
        NestBullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST ?? 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
            },
        }),
        NestBullModule.registerQueue({
            name: 'order-queue',
        }),
        NestBullModule.registerQueue({
            name: 'email-queue',
        }),
    ],
    exports: [NestBullModule],
})
export class BullConfigModule { }