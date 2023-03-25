import { PrismaService } from './prisma/prisma.service';
import { Product } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<{ data: Product[] }> {
    return { data: await this.prisma.product.findMany() };
  }
}
