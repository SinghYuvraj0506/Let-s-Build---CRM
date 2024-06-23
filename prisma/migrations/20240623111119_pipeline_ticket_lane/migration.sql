-- CreateTable
CREATE TABLE "Pipeline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subAccountId" TEXT NOT NULL,

    CONSTRAINT "Pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lane" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Lane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "laneId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "value" DECIMAL(65,30),
    "description" TEXT,
    "customerId" TEXT,
    "assignedUserId" TEXT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subAccountId" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subAccountId" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TagToTicket" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Pipeline_subAccountId_idx" ON "Pipeline"("subAccountId");

-- CreateIndex
CREATE INDEX "Lane_pipelineId_idx" ON "Lane"("pipelineId");

-- CreateIndex
CREATE INDEX "Ticket_laneId_idx" ON "Ticket"("laneId");

-- CreateIndex
CREATE INDEX "Ticket_customerId_idx" ON "Ticket"("customerId");

-- CreateIndex
CREATE INDEX "Ticket_assignedUserId_idx" ON "Ticket"("assignedUserId");

-- CreateIndex
CREATE INDEX "Contact_subAccountId_idx" ON "Contact"("subAccountId");

-- CreateIndex
CREATE INDEX "Tag_subAccountId_idx" ON "Tag"("subAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToTicket_AB_unique" ON "_TagToTicket"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToTicket_B_index" ON "_TagToTicket"("B");

-- AddForeignKey
ALTER TABLE "Pipeline" ADD CONSTRAINT "Pipeline_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lane" ADD CONSTRAINT "Lane_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_laneId_fkey" FOREIGN KEY ("laneId") REFERENCES "Lane"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTicket" ADD CONSTRAINT "_TagToTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTicket" ADD CONSTRAINT "_TagToTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
