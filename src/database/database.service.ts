import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  constructor(private readonly sequelize: Sequelize, private readonly configService: ConfigService) {}
  async onModuleInit() {
    try {
      await this.sequelize.authenticate();
      console.log(`✅ OnModuleInit: Database ${this.configService.getOrThrow('DB_DATABASE')} connected successfully `);
    } catch (error) {
      console.error(`❌ Unable to connect to the database ${this.configService.getOrThrow('DB_DATABASE')}:`, error);
    }
  }

  async onApplicationShutdown(signal?: string) {
    await this.sequelize.close();
    console.log(
      `🔥 🔥 🔥 🔥 🔥 onApplicationShutdown called with signal: ${signal} 🔥 🔥 🔥 🔥 🔥`,
    );
  }
}
