import { Module } from '@nestjs/common';

import { CaslAbilityFactory } from './casl.factory';

@Module({
  imports: [],
  providers: [CaslAbilityFactory],
})
export class PermissionModule {}
