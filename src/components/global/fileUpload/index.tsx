import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadThing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface Props {
  apiEndpoint: "agencyLogo" | "subaccountLogo" | "avatar";
  onChange: (url?: string) => void;
  value?: string;
}

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const docType = value?.split(".")[1];

  if (docType) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        {docType !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="uploaded Image"
              className="object-contain"
              fill
            />
          </div>
        ) : (
          <div>
            <FileIcon/>
            <a href={value} target="_blank" rel="noopener_noreferrer">
              View PDF
            </a>
          </div>
        )}


        <Button onClick={()=>{onChange("")}} variant="ghost" type="button">
            <X className="h-4 w-4"/>
            Remove Logo
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30">
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          onChange(res[0]?.url);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
    </div>
  );
};

export default FileUpload;
