"use client";
import { Media } from "@prisma/client";
import React, { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { deleteMedia, generateNotificationLogs } from "@/lib/querries";
import { useRouter } from "next/navigation";

type Props = {
  file: Media;
};

const MediaCard = ({ file }: Props) => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast();
  const router = useRouter()

  return (
    <AlertDialog>
      <DropdownMenu>
        <article className="border w-full rounded-lg bg-slate-900">
          <div className="relative w-full h-40">
            <Image
              src={file.link}
              alt="preview image"
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <p className="opacity-0 h-0 w-0">{file.name}</p>
          <div className="p-4 relative">
            <p className="text-muted-foreground">
              {file.createdAt.toDateString()}
            </p>
            <p>{file.name}</p>
            <div className="absolute top-4 right-4 p-[1px] cursor-pointer ">
              <DropdownMenuTrigger>
                <MoreHorizontal />
              </DropdownMenuTrigger>
            </div>
          </div>

          <DropdownMenuContent>
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                navigator.clipboard.writeText(file.link);
                toast({ title: "Copied To Clipboard" });
              }}
            >
              <Copy size={15} /> Copy Image Link
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2">
                <Trash size={15} /> Delete File
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </article>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
          Are you sure you want to delete this file? All subaccount using this
          file will no longer have access to it!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive"
            onClick={async () => {
              setLoading(true)
              const response = await deleteMedia(file.id)
              await generateNotificationLogs(`Deleted a media file | ${response?.name}`,undefined,response?.subAccountId)
              toast({
                title: 'Deleted File',
                description: 'Successfully deleted the file',
              })
              setLoading(false)
              router.refresh()
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MediaCard;
