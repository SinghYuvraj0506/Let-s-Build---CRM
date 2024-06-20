import { getUserAuthDetails } from "@/lib/querries";
import React from "react";
import MenuOptions from "./menu-options";

type Props = {
  id: string;
  type: "agency" | "subaccount";
};

const Sidebar = async ({ id, type }: Props) => {
  const user = await getUserAuthDetails();

  if (!user) return;

  if (!user?.Agency) return;

  const accountDetails =
    type === "agency"
      ? user?.Agency
      : user?.Agency?.SubAccount.find((account) => account?.id === id);

  if (!accountDetails) {
    return;
  }
  const sidebarLogo =
    type === "agency"
      ? user?.Agency?.agencyLogo
      : user?.Agency?.whiteLabel
      ? user?.Agency?.SubAccount.find((account) => account?.id === id)
          ?.subAccountLogo || user?.Agency?.agencyLogo
      : user?.Agency?.agencyLogo;

  const sidebarOpt =
    type === "agency"
      ? user.Agency.SidebarOption || []
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.SidebarOption || [];

  // users having access to all the subaccounts ------------
  const subAccounts = user?.Agency.SubAccount.filter((subaacount) =>
    user?.Permissions.find((permisson) => {
      permisson.subAccountId === subaacount.id && permisson.access;
    })
  );

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        sidebarLogo={sidebarLogo}
        sidebarOpts={sidebarOpt}
        subAccounts={subAccounts}
        id={id}
        accountDetails={accountDetails}
        user={user}
      />
      <MenuOptions
        sidebarLogo={sidebarLogo}
        sidebarOpts={sidebarOpt}
        subAccounts={subAccounts}
        id={id}
        accountDetails={accountDetails}
        user={user}
      />
    </>
  );
};

export default Sidebar;
