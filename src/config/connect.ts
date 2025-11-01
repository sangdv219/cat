// src/config/sequelize.config.ts
import { ConfigService } from '@nestjs/config';
import { PostgresDialect } from '@sequelize/postgres';
import { Sequelize } from '@sequelize/core';
import { config } from 'dotenv';

config();
const configService = new ConfigService();
export function createSequelizeInstance() {
  const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: configService.getOrThrow('DB_DATABASE'),
    user: configService.getOrThrow('DB_USER'),
    password: configService.getOrThrow('DB_PASSWORD'),
    host: configService.getOrThrow('DB_HOST') || 'localhost',
    port: parseInt(configService.getOrThrow('DB_PORT'), 10),
    clientMinMessages: 'notice',
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log('Database connection established successfully.');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
}