import Unauthorized from "@/components/unauthorized";
import { getUserAuthDetails, verifyandAcceptInvitation } from "@/lib/querries";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const agencyId = await verifyandAcceptInvitation();

  if (!agencyId) {
    return <Unauthorized />;
  }

  const user = await getUserAuthDetails();

  if (!user) {
    return null;
  }

  const getFirstSubaccountWithAccess = user.Permissions.find(
    (perm) => perm.access
  );

  if (getFirstSubaccountWithAccess) {
    return redirect(
      `/subaccount/${getFirstSubaccountWithAccess?.subAccountId}`
    );
  }

  return <Unauthorized />;
};

export default page;
