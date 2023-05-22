import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { EmailModule } from './email/email.module';
import { HealthModule } from './health/health.module';
import { NotificationModule } from './notification/notification.module';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    EmailModule,
    NotificationModule,
    HealthModule,
    AuthModule,
    PermissionModule,
    UserModule,
  ],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
