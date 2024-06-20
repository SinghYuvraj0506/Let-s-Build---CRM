import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/infoBar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import {
  getNotificationsForAdmin,
  verifyandAcceptInvitation,
} from "@/lib/querries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { agencyId: string };
};

const layout = async ({ children, params }: Props) => {
  const agencyId = await verifyandAcceptInvitation();
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  if (!agencyId) {
    return redirect("/agency");
  }

  if (
    user.privateMetadata.role !== "AGENCY_ADMIN" &&
    user.privateMetadata.role !== "AGENCY_OWNER"
  ) {
    return <Unauthorized />;
  }

  let allNotifications: any = [];
  const notifications = await getNotificationsForAdmin(agencyId);
  if (notifications) {
    allNotifications = notifications;
  }

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar notifications={allNotifications} role={user.privateMetadata.role}/>
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default layout;
