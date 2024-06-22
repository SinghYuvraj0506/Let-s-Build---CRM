"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubAccount, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../global/fileUpload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import {
  changeAccountPermissions,
  generateNotificationLogs,
  getUserAccountPermissions,
  getUserAuthDetails,
  updateUser,
} from "@/lib/querries";
import { useModal } from "@/providers/modalProvider";
import { Switch } from "../ui/switch";
import { AuthUserWithAgencySigebarOptionsSubAccounts, UsersWithSubAccountPermissions } from "@/lib/types";
import { Separator } from "../ui/separator";

type Props = {
  id?: string;
  type: "agency" | "subaccount";
  userData?: Partial<User>;
  subAccounts?: SubAccount[];
};

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email("Invalid email addresss"),
  avatarUrl: z.string(),
  role: z.enum([
    "AGENCY_OWNER",
    "AGENCY_ADMIN",
    "SUBACCOUNT_USER",
    "SUBACCOUNT_GUEST",
  ]),
});

const UserDetails: React.FC<Props> = ({ userData, type, subAccounts }) => {
  const [roleInfo, setRoleInfo] = useState("");
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [subAccountPermissions, setSubAccountPermissions] =
    useState<UsersWithSubAccountPermissions>(null);
  const [authUserData, setAuthUserData] =
    useState<AuthUserWithAgencySigebarOptionsSubAccounts | null>(null)

  const { data, setClose } = useModal();

  const { toast } = useToast();
  const router = useRouter();

  // show permission in the team side only not user settings ------------
  useEffect(() => {
    if (!data?.user) return;

    const getPermissions = async () => {
      if (!data.user) return;
      const userData = await getUserAccountPermissions(data?.user?.id);
      setSubAccountPermissions(userData);
    };
    getPermissions();
  }, [data?.user]);

  useEffect(() => {
    if (data.user) {
      const fetchDetails = async () => {
        const response = await getUserAuthDetails()
        if (response) setAuthUserData(response)
      }
      fetchDetails()
    }
  }, [data])


  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.user?.name ? data?.user?.name : userData?.name,
      email: data?.user?.email ? data?.user?.email : userData?.email,
      avatarUrl: data?.user?.avatarUrl
        ? data?.user?.avatarUrl
        : userData?.avatarUrl,
      role: data?.user?.role ? data?.user?.role : userData?.role,
    },
  });

  useEffect(() => {
    if (data.user) {
      form.reset(data.user)
    }
    if (userData) {
      form.reset(userData)
    }
  }, [userData, data])

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (userData?.id || data?.user) {
      const updatedUser = await updateUser({
        id: data?.user?.id || userData?.id,
        ...values,
      });

      // save logs for each sub account id ------
      authUserData?.Agency?.SubAccount.filter((subacc) =>
        authUserData?.Permissions.find(
          (p) => p.subAccountId === subacc.id && p.access
        )
      ).forEach(async (subaccount:SubAccount) => {
        await generateNotificationLogs(`Updated ${authUserData?.name} information`,undefined,subaccount.id)
      })


      if (updatedUser) {
        toast({
          title: "Success",
          description: "Update User Information",
        });
        router.refresh();
        setClose();
      } else {
        toast({
          variant: "destructive",
          title: "Oppse!",
          description: "Could not update user information",
        });
      }
    } else {
      console.log("Error could not submit");
    }
    router.refresh();
  };

  const ChangePermissions = async (
    value: boolean,
    permissionId: string,
    subAccountId: string
  ) => {
    try {
      if (!data?.user) {
        return null;
      }
      setLoadingPermissions(true);
      const response = await changeAccountPermissions(
        permissionId,
        value,
        data?.user?.email,
        subAccountId
      );

      await generateNotificationLogs(
        `Gave ${data?.user?.name} access to | ${
          subAccountPermissions?.Permissions.find(
            (p) => p.subAccountId === subAccountId
          )?.SubAccount.name
        } `,
        data?.user?.agencyId as string,
        subAccountPermissions?.Permissions.find(
          (p) => p.subAccountId === subAccountId
        )?.SubAccount.id
      );

      if (response) {
        toast({
          title: "Success",
          description: "The request was successfull",
        });

        if (subAccountPermissions) {
          // update the subaccount permission

          setSubAccountPermissions((prev)=>{
            let oldPermissions = prev?.Permissions;
            let perm = oldPermissions?.find((perm) => (perm.subAccountId === subAccountId))
            if(perm){
              perm.access = value;
            }

            return {...prev,Permissions:oldPermissions}
          })

          subAccountPermissions.Permissions.find((perm) => {
            if (perm.subAccountId === subAccountId) {
              return { ...perm, access: !perm.access };
            }
            return perm;
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Could not update permissions",
        });
      }
      router.refresh();
      setLoadingPermissions(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not update permissions",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas,
          soluta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 items-start"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>User Profile</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="avatar"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>User Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>User&apos;s Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>User Role</FormLabel>
                  <Select
                    disabled={field.value === "AGENCY_OWNER"}
                    value={field.value}
                    onValueChange={(value) => {
                      if (
                        value === "SUBACCOUNT_USER" ||
                        value === "SUBACCOUNT_GUEST"
                      ) {
                        setRoleInfo(
                          "You need to have subaccounts to assign Subaccount access to team members."
                        );
                      } else {
                        setRoleInfo("");
                      }

                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                      {(data?.user?.role === "AGENCY_OWNER" ||
                        userData?.role === "AGENCY_OWNER") && (
                        <SelectItem value="AGENCY_OWNER">
                          Agency Owner
                        </SelectItem>
                      )}
                      <SelectItem value="SUBACCOUNT_USER">
                        Sub Account User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Sub Account Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">{roleInfo}</p>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loading /> : "Save User Information"}
            </Button>

            {(data?.user?.role === "AGENCY_OWNER" ||
              userData?.role === "AGENCY_OWNER") && (
                <div>
                <Separator className="my-4" />
                <FormLabel> User Permissions</FormLabel>
                <FormDescription className="mb-4">
                  You can give Sub Account access to team member by turning on
                  access control for each Sub Account. This is only visible to
                  agency owners
                </FormDescription>

                <div className="flex flex-col gap-4">
                  {subAccounts?.map((account) => {
                    const accountPermission =
                    subAccountPermissions?.Permissions.find(
                      (p) => p.subAccountId === account.id
                    )

                    return (
                      <div
                        key={account?.id}
                        className="flex items-center justify-between w-full p-2 py-4 border rounded-md"
                      >
                        {account?.name}
                        <Switch
                          disabled={loadingPermissions}
                          checked={accountPermission?.access}
                          onCheckedChange={(e) => {
                            ChangePermissions(e, accountPermission?.id as string,account?.id);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
