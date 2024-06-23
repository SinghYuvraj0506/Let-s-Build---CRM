import BlurPage from "@/components/global/blur-page";
import MediaComponent from "@/components/media";
import { getAccountMedia } from "@/lib/querries";
import React from "react";

type Props = {
  params: {
    subaccountId: string;
  };
};

const page = async ({ params }: Props) => {
  const mediaFiles = await getAccountMedia(params.subaccountId);

  return (
    <BlurPage>
      <MediaComponent data={mediaFiles} subaccountId={params.subaccountId} />
    </BlurPage>
  );
};

export default page;
