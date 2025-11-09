import { AuditModule } from '@audit/audit.module';
import { BullModule } from '@bull/bull.module';
import { DatabaseModule } from '@database/database.module';
import { DatabaseService } from '@database/database.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@redis/redis.module';
import { ClsModule } from 'nestjs-cls';
import { ChatGateway } from './gateways/chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'] }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true } // auto bind context cho mỗi request
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? (() => { throw new Error('Missing JWT_SECRET')})(),
      signOptions: { expiresIn: '1h' },
    }),
    RedisModule.forRootAsync(),
    DatabaseModule,
    BullModule,
    AuditModule,
  ],
  providers: [ChatGateway, DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
