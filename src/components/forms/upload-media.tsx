import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import FileUpload from "../global/fileUpload";
import { Button } from "../ui/button";
import { createAccountMedia, generateNotificationLogs } from "@/lib/querries";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useModal } from "@/providers/modalProvider";

type Props = {
  subaccountId: string;
};

const formSchema = z.object({
  link: z.string().min(1, { message: "Media File is required" }),
  name: z.string().min(1, { message: "Name is required" }),
});

const UploadMediaForm = ({ subaccountId }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const {setClose} = useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await createAccountMedia(
        subaccountId,
        values.name,
        values.link
      );
      await generateNotificationLogs(
        `Uploaded a media file | ${response?.name}`,
        undefined,
        subaccountId
      );

      toast({ title: "Success", description: "Uploaded media" });
      router.refresh();
      setClose()
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not uploaded media",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Media Information</CardTitle>
        <CardDescription>
          Please enter the details for your file
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your agency name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media File</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4">
              Upload Media
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UploadMediaForm;
