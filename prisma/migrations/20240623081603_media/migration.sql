-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "subAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_link_key" ON "Media"("link");

-- CreateIndex
CREATE INDEX "Media_subAccountId_idx" ON "Media"("subAccountId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
