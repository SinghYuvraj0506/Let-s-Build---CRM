import { SubAccountWithMedia } from "@/lib/types";
import React from "react";
import MediaUploadButton from "./upload-button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import MediaCard from "./media-card";
import { FolderSearch } from "lucide-react";

type Props = {
  data: SubAccountWithMedia;
  subaccountId: string;
};

const MediaComponent = ({ data, subaccountId }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center w-full justify-between">
        <h1>Media Bucket</h1>
        <MediaUploadButton subaccountId={subaccountId} />
      </div>

      <Command className="bg-transparent">
        <CommandInput placeholder="Search for media files...." />
        <CommandList className="pb-20 max-h-full">
          <CommandEmpty>No files found.</CommandEmpty>
          <CommandGroup heading="Media Files">
            <div className="flex flex-wrap gap-4 pt-4">
              {data?.Media?.map((file) => (
                <CommandItem
                  key={file.id}
                  className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <MediaCard file={file} />
                </CommandItem>
              ))}
              {!data?.Media.length && (
                <div className="flex items-center justify-center w-full flex-col">
                  <FolderSearch
                    size={200}
                    className="dark:text-muted text-slate-300"
                  />
                  <p className="text-muted-foreground ">
                    Empty! no files to show.
                  </p>
                </div>
              )}
            </div>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaComponent;
