import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { getUserAuthDetails } from "@/lib/querries";
import Link from "next/link";
import Image from "next/image";
import DeleteButton from "./_components/delete_button";
import CreateSubAccount from "./_components/create_subaccount_button";

type Props = {
  params: {
    agencyId: string;
  };
};

const page = async ({ params }: Props) => {
  const user = await getUserAuthDetails();

  if (!user) return null;

  return (
    <AlertDialog>
      <div className="flex flex-col w-full gap-4 items-end">
        <CreateSubAccount
          user={user}
          className="w-[200px] self-end m-6"
        />
        <Command className="rounded-lg bg-transparent border-none">
          <CommandInput placeholder="Search Account..." />
          <CommandList className="mt-4">
            <CommandEmpty>No accounts found.</CommandEmpty>
            {user?.Agency?.SubAccount &&
              user?.Agency?.SubAccount?.length > 0 && (
                <CommandGroup heading="Sub Accounts">
                  {user?.Agency?.SubAccount?.map((account) => {
                    return (
                      <CommandItem
                        key={account?.id}
                        className="h-32 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                      >
                        <Link
                          href={`/subaccount/${account?.id}`}
                          className="flex gap-4 w-full h-full"
                        >
                          <div className="relative w-32">
                            <Image
                              src={account?.subAccountLogo}
                              alt="Subaccount logo"
                              className="rounded-md object-contain bg-muted/50 p-4"
                              fill
                            />
                          </div>

                          <div className="flex flex-col">
                            {account?.name}
                            <span className="text-muted-foreground text-xs">
                              {account?.address}
                            </span>
                          </div>
                        </Link>

                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant={"destructive"}>
                            Delete
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your sub account and remove
                              your account data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive hover:bg-destructive">
                              <DeleteButton subaccountId={account?.id}/>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            <CommandSeparator />
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};

export default page;
