import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Product } from '@prisma/client';
import { AppModule } from './../src/app.module';
import { eachLike } from 'pactum-matchers';
import { spec, request } from 'pactum';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3300);
    request.setBaseUrl('http://localhost:3300');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get all products', async () => {
    const mockProd: Product = {
      id: 0,
      name: 'Shiver',
      slug: 'shiver',
      description: 'shiver',
      price: 0,
      price_id: 'price...',
      imageUrl: 'image.com',
    };

    return await spec()
      .get('/products')
      .expectStatus(200)
      .expectJson({
        products: eachLike(mockProd),
      });
  });
});
