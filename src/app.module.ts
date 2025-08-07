import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { redisStore } from 'cache-manager-ioredis-yet';
import { createSequelizeInstance } from 'config/connect';
import { config } from "dotenv";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { JwtModule } from '@nestjs/jwt';

config();
createSequelizeInstance()
const configService = new ConfigService();
@Module({
  imports: [
    ScheduleModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(configService.getOrThrow('DB_PORT'), 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      synchronize: true,
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          host: 'localhost',
          port: 6379,
          ttl: 0, // default TTL = 5 phút
        }),
      }),
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? (() => { throw new Error('Missing JWT_SECRET') })(),
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
