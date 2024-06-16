import AgencyDetails from "@/components/forms/agency-details";
import { getUserAuthDetails, verifyandAcceptInvitation } from "@/lib/querries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: { plan: string; state: string };
}) => {
  const agencyId = await verifyandAcceptInvitation();
  const userData = await getUserAuthDetails();

  if (agencyId) {
    if (
      userData?.role === "SUBACCOUNT_GUEST" ||
      userData?.role === "SUBACCOUNT_USER"
    ) {
      // migrate to subaccounts ----
      return redirect("/subaccount");
    } else if (
      userData?.role === "AGENCY_ADMIN" ||
      userData?.role === "AGENCY_OWNER"
    ) {
      // migrate to subaccounts ----

      if (searchParams?.plan) {
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams?.plan}`
        );
      }

      if (searchParams?.state) {
      } else {
        return redirect(`/agency/${agencyId}`);
      }
    } else {
      return <div>Not Authorized</div>;
    }
  }

  const authUser = await currentUser();

  return (
    <div className="flex items-center justify-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl flex flex-col gap-6 items-center">
        <h1 className="text-4xl">Create An Agency</h1>
        <AgencyDetails data={{companyEmail:authUser?.emailAddresses[0].emailAddress}}/>
      </div>
    </div>
  );
};

export default page;
