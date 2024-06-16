"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "./db";
import { Agency, User } from "@prisma/client";
import { connect } from "http2";

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
      avatar_url: authUser?.imageUrl,
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

export const deleteAgency = async (
  agencyId: string
) => {
  const response = await db.agency.delete({
    where: { id: agencyId }
  });

  return response;
};
