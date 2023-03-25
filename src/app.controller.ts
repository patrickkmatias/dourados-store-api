import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/products', 301)
  getHome() {
    return;
  }

  @Get('/products')
  findAll() {
    return this.appService.findAll();
  }

  @Get('/products/:id')
  findOne(@Param('id') id: number) {
    return this.appService.findOne(+id);
  }
}
