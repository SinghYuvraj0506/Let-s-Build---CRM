import { Contact, Lane, Notification, Prisma, Role, Tag, Ticket, User } from "@prisma/client";
import { db } from "./db";
import { getAccountMedia, getUserAccountPermissions, getUserAuthDetails } from "./querries";
import { z } from "zod";

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

  // export type TicketsAndTags = Ticket & {
  //   Tags: Tag[],
  //   Assigned: User | null,
  //   Customer: Contact | null
  // }

  // export type LaneDetails  = Lane & {
  //   Tickets : TicketsAndTags
  // }

  export const CreatePipelineFormSchema = z.object({
    name: z.string().min(1)
  })