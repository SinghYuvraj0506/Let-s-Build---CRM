import { Notification, Prisma, Role } from "@prisma/client";
import { db } from "./db";
import { getAccountMedia, getUserAccountPermissions, getUserAuthDetails } from "./querries";

export type NotificationWithUser = ({
  User: {
    id: string;
    name: string;
    avatarUrl: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    role: Role;
    agencyId: string;
  };
} & Notification)[];


const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
  agencyId: string
) => {
  return await db.user.findFirst({
    where: { Agency: { id: agencyId } },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  })
}


export type UsersWithAgencySubAccountPermissionsSidebarOptions =
  Prisma.PromiseReturnType<
    typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
  >

  export type UsersWithSubAccountPermissions =
  Prisma.PromiseReturnType<
    typeof getUserAccountPermissions
  >
  
    export type AuthUserWithAgencySigebarOptionsSubAccounts  =
  Prisma.PromiseReturnType<
    typeof getUserAuthDetails
  >


  export type SubAccountWithMedia  =
  Prisma.PromiseReturnType<
    typeof getAccountMedia
  >