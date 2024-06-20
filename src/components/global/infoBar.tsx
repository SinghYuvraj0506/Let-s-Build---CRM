"use client";

import { NotificationWithUser } from "@/lib/types";
import { UserButton } from "@clerk/nextjs";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { Card } from "../ui/card";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Props = {
  notifications: NotificationWithUser | [];
  className?: string;
  subAccountId?: string;
  role?: string;
};

const InfoBar: React.FC<Props> = ({
  notifications,
  className,
  subAccountId,
  role,
}) => {
  const [allNotifications, setAllNotifications] = useState(notifications);
  const [showAll, setShowAll] = useState(false);

  const handleClick = () => {
    if (showAll) {
      setAllNotifications(
        allNotifications.filter((noti) => {
          noti?.subAccountId === subAccountId;
        }) ?? []
      );
    } else {
      setAllNotifications(notifications);
    }

    setShowAll((prev) => !prev);
  };

  return (
    <div
      className={twMerge(
        "fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex  gap-4 items-center border-b-[1px] ",
        className
      )}
    >
      <div className="flex gap-2 ml-auto">
        <UserButton afterSignOutUrl="/" />
        <Sheet>
          <SheetTrigger>
            <Button variant={"outline"} size={"icon"}>
              <Bell size={17} />
            </Button>
          </SheetTrigger>

          <SheetContent className="mt-4 mr-4 pr-4 flex flex-col">
            <SheetHeader className="text-left">
              <SheetTitle>Notifications</SheetTitle>
              {subAccountId && <SheetDescription>
                {role === "AGENCY_ADMIN" ||
                  (role === "AGENCY_OWNER" && (
                    <Card className="flex items-center justify-between p-4">
                      Current Subaccount
                      <Switch onChangeCapture={handleClick} />
                    </Card>
                  ))}
              </SheetDescription>}
            </SheetHeader>

            {allNotifications?.map((notification) => {
              return (
                <div
                  key={notification?.id}
                  className="flex flex-col gap-y-2 mb-2 overscroll-x-auto text-ellipsis"
                >
                  <div className="flex gap-2">
                    <Avatar>
                      <AvatarImage
                        src={notification?.User?.avatarUrl}
                        alt="Profile Picture"
                      />
                      <AvatarFallback>
                        {notification?.User?.name.split(" ")[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <p>
                        <span className="font-bold">
                          {notification?.notification?.split("|")[0]}
                        </span>
                        <span className="text-muted-foreground">
                          {notification?.notification?.split("|")[1]}
                        </span>
                        <span className="font-bold">
                          {notification?.notification?.split("|")[2]}
                        </span>
                      </p>

                      <small className="text-xs text-muted-foreground">{new Date(notification?.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                </div>
              );
            })}

            {allNotifications?.length === 0 &&
                <div className="flex text-muted-foreground items-center justify-center mt-4">
                    You have no notifications
                </div>
            }
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default InfoBar;
