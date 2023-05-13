import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, PermissionModule, UserModule],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
