"use client";

import UserDetails from "@/components/forms/user-details";
import CustomModal from "@/components/global/custom-modal";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { deleteUser, getUser } from "@/lib/querries";
import { UsersWithAgencySubAccountPermissionsSidebarOptions } from "@/lib/types";
import { useModal } from "@/providers/modalProvider";
import { Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const columns: ColumnDef<UsersWithAgencySubAccountPermissionsSidebarOptions>[] =
  [
    {
      accessorKey: "id",
      header: "",
      cell: () => {
        return null;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const avatarUrl = row.getValue("avatarUrl") as string;
        return (
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 relative flex-none">
              <Image
                src={avatarUrl}
                fill
                className="rounded-full object-cover"
                alt="avatar image"
              />
            </div>
            <span>{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "avatarUrl",
      header: "",
      cell: () => {
        return null;
      },
    },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "SubAccount",
      header: "Owned Accounts",
      cell: ({ row }) => {
        const isAgencyOwner = row.getValue("role") === "AGENCY_OWNER";
        const ownedAccounts = row.original?.Permissions.filter((e) => e.access);

        if (isAgencyOwner) {
          return (
            <div className="flex flex-col items-start">
              <div className="flex flex-col gap-2">
                <Badge className="bg-slate-600 whitespace-nowrap">
                  Agency - {row?.original?.Agency?.name}
                </Badge>
              </div>
            </div>
          );
        }

        return (
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-2">
              {ownedAccounts?.length ? (
                ownedAccounts.map((account) => (
                  <Badge
                    key={account.id}
                    className="bg-slate-600 w-fit whitespace-nowrap"
                  >
                    Sub Account - {account.SubAccount.name}
                  </Badge>
                ))
              ) : (
                <div className="text-muted-foreground">No Access Yet</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role: Role = row.getValue("role");
        return (
          <Badge
            className={clsx({
              "bg-emerald-500": role === "AGENCY_OWNER",
              "bg-orange-400": role === "AGENCY_ADMIN",
              "bg-primary": role === "SUBACCOUNT_USER",
              "bg-muted": role === "SUBACCOUNT_GUEST",
            })}
          >
            {role}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rowData = row.original;

        return <CellActions rowData={rowData} />;
      },
    },
  ];

type CellActionProps = {
  rowData: UsersWithAgencySubAccountPermissionsSidebarOptions;
};

const CellActions = ({ rowData }: CellActionProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setOpen } = useModal();

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            className="flex gap-2"
            onClick={() =>
              navigator.clipboard.writeText(rowData?.email as string)
            }
          >
            <Copy size={15} /> Copy Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                <CustomModal
                  subHeading="You can change permissions only when the user has an owned subaccount"
                  heading="Edit User Details"
                >
                  <UserDetails
                    type="agency"
                    subAccounts={rowData?.Agency?.SubAccount}
                  />
                </CustomModal>,
                async () => {
                  return { user: await getUser(rowData?.id as string) };
                }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          {(rowData?.role as string) !== "AGENCY_OWNER" && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2">
                <Trash size={15} /> Remove User
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              className="bg-destructive hover:bg-destructive"
              onClick={async () => {
                setLoading(true);
                await deleteUser(rowData?.id as string);
                toast({
                  title: "Deleted User",
                  description:
                    "The user has been deleted from this agency they no longer have access to the agency",
                });
                setLoading(false);
                router.refresh();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DropdownMenu>
    </AlertDialog>
  );
};
