import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { HealthModule } from './health/health.module';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [HealthModule, AuthModule, PermissionModule, UserModule],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
