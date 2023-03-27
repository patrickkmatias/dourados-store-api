import { PrismaService } from './../src/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Product } from '@prisma/client';
import { AppModule } from './../src/app.module';
import { eachLike, like } from 'pactum-matchers';
import { spec, request } from 'pactum';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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

    prisma = app.get(PrismaService);
    request.setBaseUrl('http://localhost:3300');
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  const mockProd: Product = {
    id: 0,
    name: 'Shiver',
    slug: 'shiver',
    description: 'shiver',
    price: 0,
    price_id: 'price...',
    imageUrl: 'image.com',
  };

  it('/ (GET) | should redirect to /products', async () => {
    return await spec().get('/').expectStatus(301);
  });

  it('/products (GET) | should get all products', async () => {
    return await spec()
      .get('/products')
      .expectStatus(200)
      .expectJsonMatch(eachLike(mockProd));
  });

  it('/products/:id (GET) | should get a product', async () => {
    return await spec()
      .get('/products/1')
      .expectStatus(200)
      .expectJsonMatch(like(mockProd));
  });
});
