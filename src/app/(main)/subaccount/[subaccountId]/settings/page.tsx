import AgencyDetails from "@/components/forms/agency-details";
import SubAccountDetails from "@/components/forms/subaccount-details";
import UserDetails from "@/components/forms/user-details";
import { db } from "@/lib/db";
import { getUserAuthDetails } from "@/lib/querries";
import React from "react";

type Props = {
  params: {
    subaccountId: string;
  };
};

const page = async ({ params }: Props) => {
  const userDetails = await getUserAuthDetails();

  if (!userDetails) {
    return null;
  }

  const accountDetails = await db.subAccount.findUnique({
    where: { id: params?.subaccountId },
    include:{
      Agency:true
    }
  });

  if (!accountDetails) return null;

  return (
    <div className="flex lg:!flex-row flex-col gap-4">
      <SubAccountDetails
        details={accountDetails}
        agencyDetails={accountDetails?.Agency}
        userId={userDetails?.id as string}
        userName={userDetails?.name as string}
      />
      <UserDetails
        id={userDetails?.id}
        type="subaccount"
        userData={userDetails}
      />
    </div>
  );
};

export default page;
