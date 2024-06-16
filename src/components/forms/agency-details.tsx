"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Agency } from "@prisma/client";
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
} from "../ui/alert-dialog";
import { NumberInput } from "@tremor/react";
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
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import {
  deleteAgency,
  generateNotificationLogs,
  updateAgencyGoal,
} from "@/lib/querries";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

interface Props {
  data?: Partial<Agency>;
}

const formSchema = z.object({
  name: z.string().min(2, "Agency name must be of 2 characters"),
  agencyLogo: z.string(),
  companyEmail: z.string().email("Enter valid email"),
  companyPhone: z.string().min(1),
  whiteLabel: z.boolean(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
});

const AgencyDetails = ({ data }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name,
      agencyLogo: data?.agencyLogo,
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset();
    }
  }, [data]);

  const onSubmit = () => {};

  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency(true);

    try {
      const res = await deleteAgency(data?.id);
      toast({
        title: "Deleted Agency",
        description: "Deleted you agency and all subaccounts",
      });
      router.refresh()
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not delete you agency",
      });
    }

    setDeletingAgency(false);
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
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
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex items-center gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your agency Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Agency Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your agency Email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full flex items-center gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyPhone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Agency Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full flex items-center gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="whiteLabel"
                  render={({ field }) => (
                    <FormItem className="w-full flex items-center gap-4 border p-4 rounded-lg">
                      <div className="flex flex-col gap-2">
                        <FormLabel>White Label</FormLabel>
                        <FormDescription>
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit. Quisquam, earum ipsa nihil enim quia sapiente
                          nesciunt magnam esse eveniet officia.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full flex items-center gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123, Demo Street" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full flex items-center gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="City" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="State" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Zip Code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full flex items-center gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="India" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {data?.id && (
                <div className="w-full flex gap-2 flex-col ">
                  <FormLabel>Create A Goal</FormLabel>
                  <FormDescription>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Consequatur officiis impedit numquam, saepe voluptates quis.
                  </FormDescription>

                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (val) => {
                      if (!data?.id) return;
                      await updateAgencyGoal(data?.id, { goal: val });
                      await generateNotificationLogs(
                        `Updated the agency goals to | ${val}`,
                        data?.id,
                        undefined
                      );
                      router.refresh();
                    }}
                    min={1}
                    className="bg-background !border !border-input"
                    placeholder="Sub Account Goal"
                  />
                </div>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Save Agency Information"}
              </Button>
            </form>
          </Form>

          {data?.id && (
            <div className="border p-4 rounded-lg flex flex-col gap-4 mt-10 border-destructive items-start">
              <div className="flex gap-5">
                <div>Danger Zone</div>
                <div className="text-muted-foreground">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas,
                  voluptatem! Voluptatem et voluptate natus vero? Perferendis
                  eius dolore voluptas dicta ducimus cumque deserunt
                  perspiciatis ullam?
                </div>
              </div>

              <AlertDialogTrigger
                className="text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-lg whitespace-nowrap"
                disabled={isLoading || deletingAgency}
              >
                {deletingAgency ? "Deleting..." : "Delete Agency"}
              </AlertDialogTrigger>
            </div>
          )}

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This action cannot be undone. This will permanently delete the
                Agency account and all related sub accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAgency}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetails;
