import { INestApplication } from '@nestjs/common';

describe('UserAdminController', () => {
  let userController: INestApplication;

    // beforeAll(async () => {
    // const moduleFixture: TestingModule = await Test.createTestingModule({
    //   imports: [UserModule, PasswordModule],
    // }).compile();

    // userController = moduleFixture.createNestApplication();
    // userController.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    // await userController.init();
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
