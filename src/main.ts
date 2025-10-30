import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { RmqService } from 'libs/common/src/rabbitMQ/rmb.service';
import { SERVICES } from 'libs/common/src/constants/services';

config();
const configService = new ConfigService();
async function bootstrap() {
  // Create a hybrid application: HTTP + Microservice
  const app = await NestFactory.create(AppModule);
   const rmqService = app.get<RmqService>(RmqService);
  // Attach TCP microservice
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: {
  //     host: 'localhost',
  //     port: configService.getOrThrow('USER_SERVICE_PORT'),
  //     retryAttempts: 5,
  //     retryDelay: 1000,
  //   },
  // });

  app.connectMicroservice<MicroserviceOptions>(rmqService.getOptions(`${SERVICES.USER_SERVICE}_QUEUE`));
  // Global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration (only works on HTTP app, not microservice-only)
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start microservice + HTTP server
  await app.startAllMicroservices();
  await app.listen(configService.getOrThrow('PORT'));  //swagger works only on HTTP server

  console.log(`🚀 HTTP server running on port ${configService.getOrThrow('PORT')}`);
  console.log(`🚀 TCP microservice running on port ${configService.getOrThrow('USER_SERVICE_PORT')}`);
}
bootstrap();
