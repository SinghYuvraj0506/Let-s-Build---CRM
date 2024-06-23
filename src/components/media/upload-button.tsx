"use client";

import React from "react";
import { Button } from "../ui/button";
import { useModal } from "@/providers/modalProvider";
import CustomModal from "../global/custom-modal";
import UploadMediaForm from "../forms/upload-media";

type Props = {
  subaccountId: string;
};

const MediaUploadButton = ({ subaccountId }: Props) => {
  const { setOpen } = useModal();

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            heading="Upload Media"
            subHeading="Upload a file to your media bucket"
          >
            <UploadMediaForm subaccountId={subaccountId} />
          </CustomModal>
        );
      }}
    >
      Upload
    </Button>
  );
};

export default MediaUploadButton;
