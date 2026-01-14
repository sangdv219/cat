import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';


config();
const configService = new ConfigService();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // convert string -> number
    }),
  );
  app.setGlobalPrefix('api')
  app.enableVersioning({ type: VersioningType.URI })
  // app.useGlobalInterceptors(new UserContextInterceptor());     inject global

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    // .addTag('cats')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'Authorization', // Tên định danh security
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  console.log(`🚀 HTTP server running on port http://localhost:${configService.getOrThrow('PORT')}/api#/`);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
