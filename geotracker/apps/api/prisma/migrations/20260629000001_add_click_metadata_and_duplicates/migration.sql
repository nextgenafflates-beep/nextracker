-- AlterTable
ALTER TABLE "ClickEvent"
ADD COLUMN "ipAddress" TEXT,
ADD COLUMN "browser" TEXT,
ADD COLUMN "device" TEXT,
ADD COLUMN "os" TEXT,
ADD COLUMN "isBot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "isDuplicate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "duplicateReason" TEXT;

CREATE INDEX IF NOT EXISTS "ClickEvent_workspaceId_isDuplicate_idx"
ON "ClickEvent"("workspaceId", "isDuplicate");
