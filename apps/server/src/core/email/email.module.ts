import { Module } from '@nestjs/common';

import { EmailService } from './email.service';
import { PrismaModule } from '../../prisma';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [EmailService],
})
export class EmailModule {}
