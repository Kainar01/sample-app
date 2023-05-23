import { User } from '@prisma/client';

export class UserSignedUpEvent {
  constructor(public user: User) {}
}
