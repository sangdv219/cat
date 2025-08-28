import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoginDto } from './modules/auth/DTO/login.dto';
import { CreatedUserAdminRequestDto } from './modules/users/DTO/user.admin.request.dto';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // convert string -> number
    }),
  );
  
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
  SwaggerModule.createDocument(app, config, {
    extraModels: [CreatedUserAdminRequestDto, LoginDto],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
