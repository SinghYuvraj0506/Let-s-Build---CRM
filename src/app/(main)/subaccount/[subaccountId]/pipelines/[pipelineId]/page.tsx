import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { getLanesWithTicketsAndTags, getPipelineDetails } from "@/lib/querries";
import { redirect } from "next/navigation";
import React from "react";
import PipelineInfoBar from "./_components/pipeline-infobar";
import PipelineSettings from "./_components/pipeline-settings";

type Props = {
  params: {
    subaccountId: string;
    pipelineId: string;
  };
};

const page = async ({ params }: Props) => {
  const pipelineDetails = await getPipelineDetails(params?.pipelineId);

  if (!pipelineDetails) {
    return redirect(`/subaccount/${params?.subaccountId}/pipelines`);
  }

  const otherPipelines = await db.pipeline.findMany({
    where: { subAccountId: params?.subaccountId },
  });

  const lanes = await getLanesWithTicketsAndTags(params?.pipelineId);

  return (
    <Tabs defaultValue="view" className="w-full">
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PipelineInfoBar
          pipelineId={params?.pipelineId}
          pipelines={otherPipelines}
          subAccountId={params?.subaccountId}
        />

        <div>
          <TabsTrigger value="view" className="!bg-background">
            Pipeline View
          </TabsTrigger>
          <TabsTrigger value="settings" className="!bg-background">
            Pipeline Settings
          </TabsTrigger>
        </div>
      </TabsList>

      <TabsContent value="view">Make changes to your account here.</TabsContent>
      <TabsContent value="settings">
        <PipelineSettings 
          pipelineId={params?.pipelineId}
          pipelines={otherPipelines}
          subaccountId={params?.subaccountId}
        />
      </TabsContent>
    </Tabs>
  );
};

export default page;
