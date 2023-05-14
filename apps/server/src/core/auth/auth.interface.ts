import { UserRole } from '@prisma/client';

export interface JWTPayload {
  userId: number;
}

export interface AuthUser {
  userId: number;
  password: string;
  isAdmin: boolean;
  roles: UserRole[];
}
