"use client";

import { Pipeline } from "@prisma/client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDownIcon, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";
import { useModal } from "@/providers/modalProvider";
import CustomModal from "@/components/global/custom-modal";
import CreatePipelineform from "@/components/forms/create-pipeline";

type Props = {
  subAccountId: string;
  pipelines: Pipeline[];
  pipelineId: string;
};

const PipelineInfoBar = ({ subAccountId, pipelineId, pipelines }: Props) => {
  const [value, setValue] = useState(pipelineId);
  const [open, setOpen] = useState(false);

  const {setOpen:SetOpenModal} = useModal()

  const handleClickCreatePipeline = () => {
    SetOpenModal(
        <CustomModal 
            heading="Create A Pipeline"
            subHeading="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia, vitae!"
        >
            <CreatePipelineform subaccountId={subAccountId}/>
        </CustomModal>
    )
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? pipelines.find((pipeline) => pipeline?.id === value)?.name
              : "Select a pipeline ..."}

            <ChevronsUpDownIcon className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No pipelines found.</CommandEmpty>
              <CommandGroup>
                {pipelines?.map((pipeline) => {
                  return (
                    <Link
                      key={pipeline?.id}
                      href={`/subaccount/${subAccountId}/pipelines/${pipeline?.id}`}
                    >
                      <CommandItem
                        value={pipeline?.id}
                        onSelect={(currentValue) => {
                          setValue(currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === pipeline?.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {pipeline?.name}
                      </CommandItem>
                    </Link>
                  );
                })}
                <Button
                  variant="secondary"
                  className="flex gap-2 w-full mt-4"
                  onClick={handleClickCreatePipeline}
                >
                  <Plus size={15} />
                  Create Pipeline
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PipelineInfoBar;
