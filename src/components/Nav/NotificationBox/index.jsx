import ListCard from "@/components/ListCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotificationBox = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Bell size={24} className="mr-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="p-0 max-h-[500px] overflow-auto relative"
      >
        <p className="p-3 border-b sticky top-0 bg-background z-10">
          Notifications
        </p>
        <ListCard className="overflow-auto relative" maxHeight="400px">
          {[
            {
              title:
                "Dj Tillu mentioned posted a counter argument to your arg 1 hour ago  sdksajdlksajdlksajdlksajdlksajdlaksdjslkjsdlksajd",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, eleifend nunc.",
            },
            {
              title: "Dj Tillu mentioned posted a counter argument to your arg",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, eleifend nunc.",
            },
            {
              title: "Dj Tillu mentioned posted a counter argument to your arg",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, eleifend nunc.",
            },
            {
              title: "Dj Tillu mentioned posted a counter argument to your arg",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, eleifend nunc.",
            },
            {
              title: "Dj Tillu mentioned posted a counter argument to your arg",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, eleifend nunc.",
            },
            {
              title: "Dj Tillu mentioned posted a counter argument to your arg",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, eleifend nunc.",
            },
            {
              title: "Dj Tillu mentioned posted a counter argument to your arg",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, eleifend nunc.",
            },
            {
              title: "Dj Tillu mentioned posted a counter argument to your arg",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, eleifend nunc.",
            },
            {
              title: "Dj Tillu mentioned posted a counter argument to your arg",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, eleifend nunc.",
            },
          ].map((notification) => (
            <Link
              key={notification.title}
              className="p-4 border-b last:border-0 border-border/40 hover:bg-primary/10 flex gap-2"
              href={"#"}
            >
              <Avatar className="size-8">
                <AvatarImage
                  src={"https://avatars.dicebear.com/api/avataaars/om.svg"}
                />
                <AvatarFallback className="text-[6px]">OM</AvatarFallback>
              </Avatar>
              <div className="w-[350px] break-words">
                <h3 className="text-sm font-medium line-clamp-2">
                  {notification.title}
                </h3>
                <p className="text-xs text-foreground line-clamp-2">
                  {notification.description}
                </p>
                <span className="font-normal text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </Link>
          ))}
        </ListCard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBox;
