-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "User_email_key" RENAME TO "User.email_unique";

-- RenameIndex
ALTER INDEX "UserRole_userId_role_key" RENAME TO "UserRole.userId_role_unique";
