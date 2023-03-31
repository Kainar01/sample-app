import { Controller, Get } from '@nestjs/common';

import { AppService } from './core.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getData(): { message: string } {
    return this.appService.getData();
  }
}
