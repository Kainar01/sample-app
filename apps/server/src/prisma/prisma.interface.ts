import { PrismaClient } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime';

export type PrismaTransactionClient = Omit<PrismaClient, ITXClientDenyList>;
