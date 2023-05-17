import { UserRole } from '@prisma/client';

export interface JWTPayload {
  userId: number;
}

export interface AuthUser {
  userId: number;
  isAdmin: boolean;
  roles: UserRole[];
}
