"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "./db";
import { Agency, Role, SubAccount, User } from "@prisma/client";

export const getUserAuthDetails = async () => {
  const authUser = await currentUser();
  if (!authUser) {
    return redirect("/sign-in");
  }

  const userData = await db.user.findUnique({
    where: { email: authUser?.emailAddresses[0]?.emailAddress },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  });

  return userData;
};

export const generateNotificationLogs = async (
  description: string,
  agencyId?: string,
  subaccountId?: string
) => {
  const authUser = await currentUser();
  let userData;

  if (authUser) {
    userData = await db.user.findUnique({
      where: { email: authUser?.emailAddresses[0]?.emailAddress },
    });
  } else {
    const response = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: {
              id: subaccountId,
            },
          },
        },
      },
    });

    if (response) {
      userData = response;
    }
  }

  if (!userData) {
    console.log("Could not find user");
  }

  if (!agencyId) {
    if (!subaccountId) {
      throw new Error("One of the agency an subaccount id is required");
    }

    const response = await db.subAccount.findUnique({
      where: { id: subaccountId },
    });

    if (response) {
      agencyId = response?.agencyId;
    } else {
      throw new Error("Invalid Subaccount id");
    }
  }

  if (subaccountId) {
    await db.notification.create({
      data: {
        notification: `${userData?.name} | ${description}`,
        User: {
          connect: {
            id: userData?.id,
          },
        },
        Agency: {
          connect: {
            id: agencyId,
          },
        },
        SubAccount: {
          connect: {
            id: subaccountId,
          },
        },
      },
    });
  } else {
    await db.notification.create({
      data: {
        notification: `${userData?.name} | ${description}`,
        User: {
          connect: {
            id: userData?.id,
          },
        },
        Agency: {
          connect: {
            id: agencyId,
          },
        },
      },
    });
  }
};

export const getNotificationsForAdmin = async (agencyId: string) => {
  try {
    const notifications = await db.notification.findMany({
      where: { agencyId: agencyId },
      include: { User: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (error) {
    console.log(error);
  }
};

export const createAgencyTeam = async (userData: User) => {
  const user = await db.user.create({
    data: userData,
  });

  return user;
};

export const verifyandAcceptInvitation = async () => {
  const authUser = await currentUser();
  if (!authUser) {
    return redirect("/sign-in");
  }

  const invitationExists = await db.invitation.findUnique({
    where: {
      email: authUser?.emailAddresses[0]?.emailAddress,
      status: "PENDING",
    },
  });

  if (invitationExists) {
    const userData = await createAgencyTeam({
      id: authUser?.id,
      email: authUser?.emailAddresses[0]?.emailAddress,
      name: authUser?.firstName + " " + authUser?.lastName,
      avatarUrl: authUser?.imageUrl,
      agencyId: invitationExists?.agencyId,
      createdAt: new Date(),
      role: invitationExists?.role,
      updatedAt: new Date(),
    });

    await generateNotificationLogs("Joined", invitationExists?.agencyId);

    if (userData) {
      await clerkClient.users.updateUserMetadata(authUser?.id, {
        privateMetadata: {
          role: userData?.role || "SUBACCOUNT_USER",
        },
      });

      await db.invitation.delete({
        where: { email: userData?.email },
      });

      return userData?.agencyId;
    } else {
      return null;
    }

    agencyId = userData?.agencyId;
  } else {
    // normal agency login
    const user = await db.user.findUnique({
      where: { email: authUser?.emailAddresses[0]?.emailAddress },
    });

    return user?.agencyId ?? null;
  }
};

export const updateAgencyGoal = async (
  agencyId: string,
  agencyDetails: Partial<Agency>
) => {
  const response = await db.agency.update({
    where: { id: agencyId },
    data: agencyDetails,
  });

  return response;
};

export const deleteAgency = async (agencyId: string) => {
  const response = await db.agency.delete({
    where: { id: agencyId },
  });

  return response;
};

export const initUser = async (newUser: Partial<User>) => {
  try {
    const user = await currentUser();

    if (!user) {
      return redirect("/sign-in");
    }

    const userData = await db.user.upsert({
      where: { email: user.emailAddresses[0].emailAddress },
      update: newUser,
      create: {
        id: user?.id,
        email: user?.emailAddresses[0]?.emailAddress,
        name: user?.firstName + " " + user?.lastName,
        avatarUrl: user.imageUrl,
        role: newUser?.role || "SUBACCOUNT_USER",
      },
    });

    await clerkClient.users.updateUserMetadata(user?.id, {
      privateMetadata: {
        role: userData?.role || "SUBACCOUNT_USER",
      },
    });

    return userData;
  } catch (error) {
    console.log(error);
  }
};

export const upsertAgency = async (agency: Agency) => {
  try {
    if (!agency.companyEmail) {
      return null;
    }

    const agencyData = await db.agency.upsert({
      where: { id: agency.id },
      update: agency,
      create: {
        ...agency,
        users: {
          connect: {
            email: agency?.companyEmail,
          },
        },
        SidebarOption: {
          create: [
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${agency.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    });

    return agencyData;
  } catch (error) {
    console.log(error);
  }
};

export const upsertSubAccount = async (subAccount: SubAccount) => {
  try {
    if (!subAccount.companyEmail) {
      return null;
    }

    const agencyOwner = await db.user.findFirst({
      where: { agencyId: subAccount?.agencyId, role: "AGENCY_OWNER" },
    });

    if (!agencyOwner) {
      return console.log("Error could not create subaccount");
    }

    const accountData = await db.subAccount.upsert({
      where: { id: subAccount.id },
      update: subAccount,
      create: {
        ...subAccount,
        Permissions: {
          create: {
            access: true,
            email: agencyOwner?.email,
          },
        },
        SidebarOption: {
          create: [
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/subaccount/${subAccount.id}/launchpad`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/subaccount/${subAccount.id}/settings`,
            },
            {
              name: "Funnels",
              icon: "pipelines",
              link: `/subaccount/${subAccount.id}/funnels`,
            },
            {
              name: "Media",
              icon: "database",
              link: `/subaccount/${subAccount.id}/media`,
            },
            {
              name: "Automations",
              icon: "chip",
              link: `/subaccount/${subAccount.id}/automations`,
            },
            {
              name: "Pipelines",
              icon: "flag",
              link: `/subaccount/${subAccount.id}/pipelines`,
            },
            {
              name: "Contacts",
              icon: "person",
              link: `/subaccount/${subAccount.id}/contacts`,
            },
            {
              name: "Dashboard",
              icon: "category",
              link: `/subaccount/${subAccount.id}`,
            },
          ],
        },
      },
    });

    return accountData;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (userData: Partial<User>) => {
  try {
    const updatedUser = await db.user.update({
      where: { id: userData?.id },
      data: userData,
    });

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

export const getSubAccount = async (id: string) => {
  try {
    const subaccount = await db.subAccount.findUnique({
      where: { id: id },
    });

    return subaccount;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSubAccount = async (id: string) => {
  try {
    const subaccount = await db.subAccount.delete({
      where: { id: id },
    });

    return subaccount;
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const user = await db.user.delete({
      where: { id: id },
    });

    return user;
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};

export const getUserAccountPermissions = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id: id },
      include: {
        Permissions: {
          include:{
            SubAccount:true
          }
        }
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.log(error);
  }
};

export const changeAccountPermissions = async (
  permissionId: string,
  value: boolean,
  email:string, 
  subaccountId:string
) => {
  try {
    const permission = await db.permissions.upsert({
      where: {
        id: permissionId
      },
      update:{access:value},
      create:{
        id:permissionId,
        email,
        subAccountId:subaccountId,
        access:value
      }
    });

    if (!permission) {
      return null;
    }

    return permission;
  } catch (error) {
    console.log(error);
  }
};

export const sendInvitation = async (role:Role, email:string, agencyId:string) => {
  try {

    const response = await db.invitation.create({
      data: { email, agencyId, role },
    })
  


    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress:email,
      redirectUrl:process.env.NEXT_PUBLIC_URL,
      publicMetadata:{
        throughInvitation:true,
        role
      }
    })

    return response;
    
  } catch (error) {
    console.log(error)
    throw error;
  }
}


export const getAccountMedia = async (id:string) => {
  try {

    const response = await db.subAccount.findUnique({
      where:{id:id},
      include:{
        Media:true
      }
    })
  
    return response;
    
  } catch (error) {
    console.log(error)
  }
}

export const createAccountMedia = async (subaccountId:string,name:string,link:string) => {
  try {
    const response = await db.media.create({
      data:{
        name,
        link,
        subAccountId:subaccountId
      }
    })
  
    return response;
    
  } catch (error) {
    console.log(error)
  }
}

export const deleteMedia = async (id:string) => {
  try {
    const response = await db.media.delete({
      where:{
        id:id
      }
    })
  
    return response;
    
  } catch (error) {
    console.log(error)
  }
}