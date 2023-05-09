import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreService {
  public getData(): { message: string } {
    return { message: 'Welcome to sample!' };
  }
}
