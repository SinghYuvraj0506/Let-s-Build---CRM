"use client"
import CreatePipelineform from "@/components/forms/create-pipeline";
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
  } from '@/components/ui/alert-dialog'
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deletePipeline, generateNotificationLogs } from "@/lib/querries";
import { Pipeline } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  subaccountId: string;
  pipelines: Pipeline[];
  pipelineId: string;
};

const PipelineSettings = ({ subaccountId, pipelines, pipelineId }: Props) => {
    const {toast} = useToast()
    const router= useRouter()

  return (
    <AlertDialog>
      <div className="flex flex-col gap-2 items-start">
        <AlertDialogTrigger>
        <Button variant={'destructive'}>Delete Pipeline</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                pipeline and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    const response = await deletePipeline(pipelineId)

                    await generateNotificationLogs(`Deleted pipeline | ${response?.name}`,undefined,subaccountId)

                    toast({
                      title: 'Deleted',
                      description: 'Pipeline is deleted',
                    })

                    router.replace(`/subaccount/${subaccountId}/pipelines`)
                  } catch (error) {
                    toast({
                      variant: 'destructive',
                      title: 'Oops!',
                      description: 'Could Delete Pipeline',
                    })
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

        <CreatePipelineform
          subaccountId={subaccountId}
          defaultData={pipelines?.find((p) => p.id === pipelineId)}
        />
      </div>
    </AlertDialog>
  );
};

export default PipelineSettings;
