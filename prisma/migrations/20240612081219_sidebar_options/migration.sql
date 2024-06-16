-- CreateEnum
CREATE TYPE "Icon" AS ENUM ('settings', 'chart', 'calendar', 'check', 'chip', 'compass', 'database', 'flag', 'home', 'info', 'link', 'lock', 'messages', 'notification', 'payment', 'power', 'receipt', 'shield', 'star', 'tune', 'videorecorder', 'wallet', 'warning', 'headphone', 'send', 'pipelines', 'person', 'category', 'contact', 'clipboardIcon');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AGENCY_OWNER', 'AGENCY_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SUBACCOUNT_USER',
    "agencyId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subAccountId" TEXT NOT NULL,
    "access" BOOLEAN NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agency" (
    "id" TEXT NOT NULL,
    "connectAccountId" TEXT DEFAULT '',
    "customerId" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "agencyLogo" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "companyPhone" TEXT NOT NULL,
    "whiteLabel" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "goal" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubAccount" (
    "id" TEXT NOT NULL,
    "connectAccountId" TEXT DEFAULT '',
    "name" TEXT NOT NULL,
    "subAccountLogo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "companyPhone" TEXT NOT NULL,
    "goal" INTEGER NOT NULL DEFAULT 5,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,

    CONSTRAINT "SubAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencySidebarOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Menu',
    "link" TEXT NOT NULL DEFAULT '#',
    "icon" "Icon" NOT NULL DEFAULT 'info',
    "agencyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgencySidebarOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubAccountSidebarOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Menu',
    "link" TEXT NOT NULL DEFAULT '#',
    "icon" "Icon" NOT NULL DEFAULT 'info',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subAccountId" TEXT,

    CONSTRAINT "SubAccountSidebarOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_agencyId_idx" ON "User"("agencyId");

-- CreateIndex
CREATE INDEX "Permissions_subAccountId_idx" ON "Permissions"("subAccountId");

-- CreateIndex
CREATE INDEX "Permissions_email_idx" ON "Permissions"("email");

-- CreateIndex
CREATE INDEX "SubAccount_agencyId_idx" ON "SubAccount"("agencyId");

-- CreateIndex
CREATE INDEX "AgencySidebarOption_agencyId_idx" ON "AgencySidebarOption"("agencyId");

-- CreateIndex
CREATE INDEX "SubAccountSidebarOption_subAccountId_idx" ON "SubAccountSidebarOption"("subAccountId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubAccount" ADD CONSTRAINT "SubAccount_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencySidebarOption" ADD CONSTRAINT "AgencySidebarOption_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubAccountSidebarOption" ADD CONSTRAINT "SubAccountSidebarOption_subAccountId_fkey" FOREIGN KEY ("subAccountId") REFERENCES "SubAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
