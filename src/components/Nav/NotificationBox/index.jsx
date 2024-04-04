"use client";

import ListCard from "@/components/ListCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Bell, Loader, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import useSWRInfinite from "swr/infinite";

const PAGE_SIZE = 2;
const NotificationBox = () => {
  const [open, setOpen] = React.useState(false);
  const [dot, setDot] = React.useState(true);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        setDot(false);
      }}
    >
      <DropdownMenuTrigger className="relative">
        <Bell size={24} className="mr-1" />
        {dot && (
          <span className="absolute -top-[0.5px] right-1 rounded-full bg-primary size-[0.8rem] text-[0.6rem] text-white flex justify-center items-center">
            2
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn("p-0 max-h-[500px] overflow-auto relative")}
      >
        <p className="p-3 border-b sticky top-0 bg-background z-10">
          Notifications
        </p>
        <NotificationItemList />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const supabase = createClient();

const fetcher = async (page) => {
  console.log(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
  const { data, error } = await supabase
    .from("Notifications")
    .select(
      "*, users!public_Notifications_sender_id_fkey(*), Argument(related_to)"
    )
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Error fetching notifications");
  }

  return data;
};

const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && previousPageData.length === 0) return null;
  return String(pageIndex);
};

const getNotificationTitle = (notification) => {
  switch (notification?.type) {
    case "counter":
      return `${notification?.users?.data?.full_name} countered your argument`;
    case "support":
      return `${notification?.users?.data?.full_name} supported your argument`;
    default:
      return "New notification";
  }
};

const NotificationItemList = ({}) => {
  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite(getKey, fetcher, {
      revalidateFirstPage: false,
      revalidateOnMount: true,
      dedupingInterval: 5000,
    });

  const isLoadingMore = isLoading || isValidating;
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  if (error) {
    console.error("Error fetching notifications", error);
  }

  const notifications = data ? data.flat() : [];

  return (
    <>
      <ListCard
        className="overflow-auto relative w-[calc(100vw-2rem)] sm:w-fit"
        maxHeight="400px"
      >
        {!isLoadingMore && notifications.length <= 0 ? (
          <div className="w-full sm:w-[350px] p-4 border-b last:border-0 border-border/40 flex justify-center items-center">
            <span className="text-sm font-medium text-muted-foreground">
              No notifications
            </span>
          </div>
        ) : null}
        {notifications?.map((notification) => (
          <Link
            key={notification.id}
            className="p-4 border-b last:border-0 border-border/40 hover:bg-primary/10 flex gap-2"
            href={`/arg/${notification?.Argument?.related_to}/#arg_${notification?.arg_id}`}
          >
            <Avatar className="size-8">
              <AvatarImage src={notification?.users?.data?.avatar_url} />
              <AvatarFallback className="text-[6px]">OM</AvatarFallback>
            </Avatar>
            <div className="w-full sm:w-[350px] break-all">
              <h3 className="text-sm font-medium line-clamp-2">
                {getNotificationTitle(notification)}
              </h3>
              <p className="text-xs text-foreground line-clamp-2">
                {notification?.message}
              </p>
              <span className="font-normal text-xs text-muted-foreground">
                {formatDistanceToNow(notification?.created_at, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </Link>
        ))}
        {isLoadingMore ? (
          <>
            {[...Array(Math.min(PAGE_SIZE, 1)).keys()].map((i) => (
              <div key={i} className="flex w-full gap-2 p-2 mt-2">
                <Skeleton className="size-12 rounded-full" />
                <div
                  key={i}
                  className="w-full sm:w-[350px]  border-b last:border-0 border-border/40 space-y-1 p-1 flex-1"
                >
                  <Skeleton className="w-2/4 h-5" />
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/4 h-3" />
                </div>
              </div>
            ))}
          </>
        ) : null}
        {!isReachingEnd && !isLoadingMore ? (
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setSize(size + 1)}
          >
            <span className="flex items-center gap-1">
              <span>Show more</span>
              {isLoadingMore ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
            </span>
          </Button>
        ) : null}
      </ListCard>
    </>
  );
};

export default NotificationBox;
