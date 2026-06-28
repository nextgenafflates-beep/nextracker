-- AlterTable
ALTER TABLE "Link"
ADD COLUMN "botFilterEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "botRedirectUrl" TEXT NOT NULL DEFAULT 'https://www.google.com';
