import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/infoBar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import {
  getNotificationsForAdmin,
  getUserAuthDetails,
  verifyandAcceptInvitation,
} from "@/lib/querries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { subaccountId: string };
};

const layout = async ({ children, params }: Props) => {
  const agencyId = await verifyandAcceptInvitation();
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  if (!agencyId) {
    return <Unauthorized />;
  }

  if(!user.privateMetadata.role){
    return <Unauthorized/>
  }
  else{
    let allPermissions = await getUserAuthDetails() 
    const hasPermisson = allPermissions?.Permissions.find((perm)=>perm.subAccountId === params.subaccountId)

    if(!hasPermisson?.access){
      return <Unauthorized/>
    }
  }

  let allNotifications: any = [];
  const notifications = await getNotificationsForAdmin(agencyId);

  if (notifications) {
    if (
      user.privateMetadata.role !== "AGENCY_ADMIN" &&
      user.privateMetadata.role !== "AGENCY_OWNER"
    ) {
      allNotifications = notifications;
    } else {
      let filteredNoti = notifications.filter(
        (noti) => noti.subAccountId === params.subaccountId
      );
      allNotifications = filteredNoti;
    }
  }

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <Sidebar id={params.subaccountId} type="subaccount" />
      <div className="md:pl-[300px]">
        <InfoBar
          notifications={allNotifications}
          role={user.privateMetadata.role as string}
        />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default layout;
