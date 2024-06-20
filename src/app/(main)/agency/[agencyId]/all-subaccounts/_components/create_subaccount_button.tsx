"use client";

import React from "react";
import SubAccountDetails from "@/components/forms/subaccount-details";
import CustomModal from "@/components/global/custom-modal";
import { useModal } from "@/providers/modalProvider";
import { Agency, AgencySidebarOption, SubAccount, User } from "@prisma/client";
import { twMerge } from "tailwind-merge";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  user: User & {
    Agency:
      | (
          | Agency
          | (null & {
              SubAccount: SubAccount[];
              SideBarOption: AgencySidebarOption[];
            })
        )
      | null;
  };

  className?: string;
};

const CreateSubAccount = ({ user, className }: Props) => {
  const { setOpen } = useModal();

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            heading="Create A Subaccount"
            subHeading="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, in!"
          >
            <SubAccountDetails
              agencyDetails={user?.Agency as Agency}
              userId={user?.id as string}
              userName={user?.name as string}
            />
          </CustomModal>
        );
      }}
      className={twMerge("w-full flex gap-4", className)}
    >
      <PlusCircleIcon size={15} />
      Create Sub Account
    </Button>
  );
};

export default CreateSubAccount;
