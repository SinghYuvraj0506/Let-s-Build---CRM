"use client";
import { CreatePipelineFormSchema } from "@/lib/types";
import { useModal } from "@/providers/modalProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Loading from "../global/loading";
import { useToast } from "../ui/use-toast";
import { Pipeline } from "@prisma/client";
import { generateNotificationLogs, upsertPipeline } from "@/lib/querries";

type Props = {
  defaultData?:Pipeline
  subaccountId: string;
};

const CreatePipelineform = ({ subaccountId,defaultData }: Props) => {
    const {toast} = useToast()
  const { setClose } = useModal();
  const router = useRouter();

  
  const form = useForm<z.infer<typeof CreatePipelineFormSchema>>({
      mode: "onChange",
      resolver: zodResolver(CreatePipelineFormSchema),
      defaultValues: {
          name: defaultData?.name || "",
        },
    });
    useEffect(() => {
      if (defaultData) {
        form.reset({
          name: defaultData.name || '',
        })
      }
    }, [defaultData])

  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof CreatePipelineFormSchema>) => {
    if (!subaccountId) return
    try {
      const response = await upsertPipeline(subaccountId,defaultData?.id as string,values?.name)

      await generateNotificationLogs(`Updates a pipeline | ${response?.name}`,undefined,subaccountId)

      toast({
        title: 'Success',
        description: 'Saved pipeline details',
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Could not save pipeline details',
      })
    }
    setClose()
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-20 mt-4" disabled={isLoading} type="submit">
              {isLoading ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePipelineform;
