import { Test, TestingModule } from '@nestjs/testing';
import { UserAdminController } from './controller/user.admin.controller';
import { UserService } from './services/user.service';
import { UserModule } from './user.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { PasswordModule } from '../password/password.module';

describe('UserAdminController', () => {
  let userController: INestApplication;

    beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule, PasswordModule],
    }).compile();

    userController = moduleFixture.createNestApplication();
    userController.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await userController.init();
  // });
   afterAll(async () => {
    // await getConnection().close(); // đóng DB
    // await userController.close();
  });

  it('/ (GET) - should return hello message', async () => {
    // const res = await request(userController.getHttpServer())
    //   .get('/admin/users')
    //   .expect(200);

    // expect(res.body).toMatchObject({
    //   message: 'Hello World!!',
    //   version: expect.any(String),
    // });
  });
});
