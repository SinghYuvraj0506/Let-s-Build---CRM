"use client";

import {
  Agency,
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOption,
} from "@prisma/client";
import React, { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import clsx from "clsx";
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import Link from "next/link";
import { useModal } from "@/providers/modalProvider";
import CustomModal from "../global/custom-modal";
import SubAccountDetails from "../forms/subaccount-details";
import { icons } from "@/lib/constants";
import { Separator } from "../ui/separator";

type Props = {
  defaultOpen?: boolean;
  sidebarOpts: AgencySidebarOption[] | SubAccountSidebarOption[];
  subAccounts: SubAccount[];
  sidebarLogo: string;
  user: any;
  accountDetails: any;
  id: any;
};

const MenuOptions = ({
  defaultOpen,
  sidebarOpts,
  subAccounts,
  sidebarLogo,
  user,
  accountDetails,
  id,
}: Props) => {
  const { setOpen } = useModal();
  const [openState, setOpenState] = useState(defaultOpen);

  // prevent hydration error --------
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet modal={false} open={openState}>
      {!defaultOpen && (
        <SheetTrigger
          asChild
          className="absolute top-4 left-4 md:hidden z-[100] flex"
        >
          <Button variant={"outline"} size={"icon"}>
            <Menu />
          </Button>
        </SheetTrigger>
      )}

      <SheetContent
        side={"left"}
        className={clsx(
          "bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6",
          {
            "hidden md:inline-block w-[300px] z-0": defaultOpen,
            "inline-block md:hidden z-[100] w-full": !defaultOpen,
          }
        )}
        showX={!defaultOpen}
      >
        <div>
          <AspectRatio ratio={16 / 9}>
            <Image
              src={sidebarLogo}
              alt="Sidebar Logo"
              className="rounded-lg object-contain"
              fill
            />
          </AspectRatio>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className="w-full my-4 flex items-center justify-between py-8 px-2"
              >
                <div className="flex items-center gap-2 text-left">
                  <Compass />
                  <div className="flex flex-col">
                    {accountDetails?.name}
                    <span className="text-muted-foreground w-2/3 overflow-hidden text-ellipsis">
                      {accountDetails?.address}
                    </span>
                  </div>
                </div>
                <ChevronsUpDown size={16} className="text-muted-foreground" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 h-80 mt-4 z-[200]">
              <Command>
                <CommandInput placeholder="Search Accounts...." />
                <CommandList>
                  <CommandEmpty>No accounts found</CommandEmpty>
                  {["AGENCY_ADMIN", "AGENCY_OWNER"].includes(user?.role) &&
                    user?.Agency && (
                      <CommandGroup heading="Agency">
                        <CommandItem className="!bg-transparent my-2 rounded-md text-primary border-[1px] border-border cursor-pointer transition-all hover:!bg-muted">
                          {defaultOpen ? (
                            <Link
                              href={`/agency/${user?.Agency?.id}`}
                              className="flex w-full gap-4 h-full"
                            >
                              <div className="relative w-16">
                                <Image
                                  src={user?.Agency?.agencyLogo}
                                  alt="Agency Logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                {user?.Agency?.name}
                                <span className="text-muted-foreground w-2/3 overflow-hidden text-ellipsis text-nowrap">
                                  {user?.Agency?.address}
                                </span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/agency/${user?.Agency?.id}`}
                                className="flex w-full gap-4 h-full"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={user?.Agency?.agencyLogo}
                                    alt="Agency Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col flex-1">
                                  {user?.Agency?.name}
                                  <span className="text-muted-foreground w-2/3 overflow-hidden text-ellipsis text-nowrap">
                                    {user?.Agency?.address}
                                  </span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      </CommandGroup>
                    )}
                  <CommandSeparator />
                  <CommandGroup heading="Accounts">
                    {subAccounts && subAccounts.length !== 0 ? (
                      subAccounts?.map((account) => (
                        <CommandItem
                          className="!bg-transparent my-2 rounded-md text-primary border-[1px] border-border cursor-pointer transition-all hover:!bg-muted"
                          key={account?.id}
                        >
                          {defaultOpen ? (
                            <Link
                              href={`/subaccount/${account?.id}`}
                              className="flex w-full gap-4 h-full"
                            >
                              <div className="relative w-16">
                                <Image
                                  src={account?.subAccountLogo}
                                  alt="Agency Logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                {account?.name}
                                <span className="text-muted-foreground w-2/3 overflow-hidden text-ellipsis text-nowrap">
                                  {account?.address}
                                </span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/subaccount/${account?.id}`}
                                className="flex w-full gap-4 h-full"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={account?.subAccountLogo}
                                    alt="Subaccount Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col flex-1">
                                  {account?.name}
                                  <span className="text-muted-foreground w-2/3 overflow-hidden text-ellipsis text-nowrap">
                                    {account?.address}
                                  </span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      ))
                    ) : (
                      <CommandItem disabled={true}>No Accounts</CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>

                {["AGENCY_ADMIN", "AGENCY_OWNER"].includes(user?.role) &&
                  user?.Agency && (
                    <SheetClose asChild>
                      <Button
                        className="w-full flex gap-2 items-center mt-4"
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
                      >
                        <PlusCircleIcon size={15} />
                        Create Sub Account
                      </Button>
                    </SheetClose>
                  )}
              </Command>
            </PopoverContent>
          </Popover>

          <p className="text-muted-foreground text-xs mb-2">MENU LINKS</p>
          <Separator className="mb-4" />
          <Command className="rounded-md overflow-visible bg-transparent">
            <CommandInput placeholder="Search..." />
            <CommandList className="py-4 overflow-visible">
              <CommandEmpty>No results found</CommandEmpty>
              <CommandGroup className="overflow-visible">
                {sidebarOpts?.map((option) => {
                    let icon;
                  const iconvalue = icons?.find(
                    (icon) => icon.value === option?.icon
                  );

                  if(iconvalue){
                    icon = <iconvalue.path />
                  }


                  return (
                    <CommandItem key={option?.id} className="md:w-[320px] w-full">
                      <Link href={option?.link} className="flex gap-2 items-center hover:bg-transparent rounded-md transition-all md:w-full w-[320px]">
                        {icon}
                        {option?.name}
                      </Link>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
