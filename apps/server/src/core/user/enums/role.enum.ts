import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  ADMIN = 'admin',
}

registerEnumType(Role, {
  name: 'Role',
});
