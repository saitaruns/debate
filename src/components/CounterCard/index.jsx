"use client";

import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { FaShieldAlt } from "react-icons/fa";
import ReadMore from "../ReadMore";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { HiDotsVertical } from "react-icons/hi";
import ReportForm from "../Forms/ReportForm";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import useConfirm from "@/hooks/useConfirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ArgumentForm from "../Forms/ArgumentForm";
import { MdOutlineReportProblem } from "react-icons/md";
import {
  ArrowBigDown,
  ArrowBigUp,
  ExternalLink,
  Link2,
  LucideSword,
} from "lucide-react";
import { formatDistance } from "date-fns";
import { DialogPortal } from "@radix-ui/react-dialog";
import { createClient } from "@/utils/supabase/client";
import { variantReturner } from "../../constants";
import useSWR from "swr";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Skeleton } from "../ui/skeleton";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import ListCard from "../ListCard";
import Image from "next/image";

const Dialogs = {
  supportFormDialog: "supportForm",
  counterFormDialog: "counterForm",
  reportFormDialog: "reportForm",
};

const supabase = createClient();

const CounterCard = ({ arg, addToArgus, className }) => {
  const [voteState, setVoteState] = useState(
    arg?.voted === "upvoted" ? 1 : arg?.voted === "downvoted" ? -1 : 0
  );
  const [voteCount, setVoteCount] = useState(arg.up_votes - arg.down_votes);
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action cannot be undone",
    "Close"
  );
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const handleVote = async (vote) => {
    const { data, error } = await supabase
      .from("ArgVoteUserMap")
      .upsert({
        arg_id: arg.id,
        type: vote,
      })
      .select();

    if (error) {
      console.error("Error updating argument", error);
    }
  };

  const upVote = () => {
    if (voteState === 0) {
      setVoteState(1);
      setVoteCount(voteCount + 1);
      // toast("You have upvoted this argument", { type: "success" });
      toast.promise(() => handleVote("upvote"), {
        loading: "Upvoting...",
        success: "You have upvoted this argument",
        error: "Error upvoting argument",
      });
    }
    if (voteState === 1) {
      setVoteState(0);
      setVoteCount(voteCount - 1);
      // toast("You have removed your upvote", { type: "success" });
      toast.promise(() => handleVote("novote"), {
        loading: "Removing upvote...",
        success: "You have removed your upvote",
        error: "Error removing upvote",
      });
    }
    if (voteState === -1) {
      setVoteState(1);
      setVoteCount(voteCount + 2);
      // toast("You have upvoted this argument", { type: "success" });
      toast.promise(() => handleVote("upvote"), {
        loading: "Upvoting...",
        success: "You have upvoted this argument",
        error: "Error upvoting argument",
      });
    }
  };

  const downVote = () => {
    if (voteState === 0) {
      setVoteState(-1);
      setVoteCount(voteCount - 1);
      // toast("You have downvoted this argument", { type: "success" });
      toast.promise(() => handleVote("downvote"), {
        loading: "Downvoting...",
        success: "You have downvoted this argument",
        error: "Error downvoting argument",
      });
    }
    if (voteState === -1) {
      setVoteState(0);
      setVoteCount(voteCount + 1);
      // toast("You have removed your downvote", { type: "success" });
      toast.promise(() => handleVote("novote"), {
        loading: "Removing downvote...",
        success: "You have removed your downvote",
        error: "Error removing downvote",
      });
    }
    if (voteState === 1) {
      setVoteState(-1);
      setVoteCount(voteCount - 2);
      // toast("You have downvoted this argument", { type: "success" });
      toast.promise(() => handleVote("downvote"), {
        loading: "Downvoting...",
        success: "You have downvoted this argument",
        error: "Error downvoting argument",
      });
    }
  };

  const openDialog = (dialog) => {
    setOpen(true);
    setDialog(dialog);
  };

  const toggleDialog = async (value) => {
    if (dialog === Dialogs.reportFormDialog) {
      return setOpen(value);
    }
    if (!value) {
      const close = await confirm();
      if (close) {
        setOpen(false);
      }
    } else {
      setOpen(true);
    }
  };

  const Forms = {
    supportForm: (
      <ArgumentForm
        arg={arg}
        closeDialog={() => setOpen(false)}
        isSupport
        addToArgus={addToArgus}
      />
    ),
    counterForm: (
      <ArgumentForm
        arg={arg}
        closeDialog={() => setOpen(false)}
        isCounter
        addToArgus={addToArgus}
      />
    ),
    reportForm: <ReportForm closeDialog={() => setOpen(false)} />,
  };

  return (
    <>
      <Dialog open={open} onOpenChange={toggleDialog}>
        <Card
          className={cn(
            "relative mb-2 shadow-md ",
            {
              "border-l-4 border-green-700": location.hash === `#arg_${arg.id}`,
            },
            className
          )}
          id={`#arg_${arg.id}`}
        >
          <CardContent className="flex p-3 pt-6 pb-0 items-start">
            <div className="flex flex-col pr-2 items-center">
              <ArrowBigUp
                size={24}
                strokeWidth={1}
                className={cn(
                  "cursor-pointer",
                  "transition-all active:-translate-y-1",
                  {
                    "fill-primary stroke-primary": voteState === 1,
                  }
                )}
                onClick={upVote}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  "transition-all",
                  voteCount > 0 ? "text-green-700" : "text-red-700"
                )}
              >
                {voteCount}
              </span>
              <ArrowBigDown
                size={24}
                strokeWidth={1}
                className={cn(
                  "cursor-pointer",
                  "transition-all active:translate-y-1",
                  {
                    "fill-destructive stroke-destructive": voteState === -1,
                  }
                )}
                onClick={downVote}
              />
            </div>
            <div className="flex flex-col flex-1">
              {arg?.counter_to ? (
                <div className="text-xs text-slate-500">
                  countering{" "}
                  <Badge
                    variant="success"
                    className="cursor-pointer"
                    onClick={() => {
                      console.log("clicked");
                      history.pushState({}, "", `#arg_${arg.counter_to}`);
                    }}
                  >
                    #{arg?.counter_to}
                  </Badge>
                </div>
              ) : null}
              {arg?.support_to ? (
                <div className="text-xs text-slate-500">
                  supporting{" "}
                  <Badge
                    variant="success"
                    className="cursor-pointer"
                    onClick={() => {
                      console.log("clicked");
                      history.pushState({}, "", `#arg_${arg.support_to}`);
                    }}
                  >
                    #{arg?.support_to}
                  </Badge>
                </div>
              ) : null}
              <ReadMore minLines={3} className="mb-3">
                {arg?.argument}
              </ReadMore>
              <ul className="w-32 sm:w-96">
                {arg?.evidence?.map((ev) => {
                  const evidence = JSON.parse(ev);
                  return (
                    <li
                      key={evidence.source}
                      className="truncate break-all w-full"
                    >
                      <Link
                        href={evidence.source}
                        target="_blank"
                        className="font-normal text-xs sm:text-sm  text-blue-700 dark:text-blue-500 hover:underline"
                      >
                        {evidence.source}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2">
                {arg?.fallacies?.map((fallacy) => (
                  <Popover key={fallacy.id}>
                    <PopoverTrigger>
                      <Badge
                        variant={variantReturner(fallacy.name)}
                        className="m-1 cursor-pointer divide-x"
                      >
                        <span className="text-xs pr-1">{fallacy?.name}</span>
                        <span className={cn("text-xs pl-1")}>
                          {fallacy?.count}
                        </span>
                      </Badge>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0"
                      align="center"
                      side="bottom"
                    >
                      <ViewLink
                        link={`https://en.wikipedia.org/api/rest_v1/page/summary/${fallacy.name}`}
                      />
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <HiDotsVertical className="" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    onClick={() => {
                      copyToClipboard(
                        location.host + location.pathname + `#arg_${arg.id}`
                      );
                      toast("Link copied to clipboard", {
                        type: "success",
                      });
                    }}
                  >
                    <Link2 size={16} /> Share
                  </DropdownMenuItem>
                  <DialogTrigger
                    asChild
                    onClick={() => openDialog(Dialogs.supportFormDialog)}
                  >
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <FaShieldAlt size={16} /> Defend
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogTrigger
                    asChild
                    onClick={() => openDialog(Dialogs.counterFormDialog)}
                  >
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <LucideSword size={16} /> Counter
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogTrigger
                    asChild
                    onClick={() => openDialog(Dialogs.reportFormDialog)}
                  >
                    <DropdownMenuItem className="cursor-pointer text-red-600 gap-2">
                      <MdOutlineReportProblem size={16} /> Report
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
          <CardFooter className="flex justify-end mt-3">
            <Link
              href={`/profile/${arg?.user_id}`}
              className="flex items-center space-x-2 group"
            >
              <Avatar className="size-4">
                <AvatarImage
                  src={
                    arg?.user_data?.avatar_url || arg?.users?.data?.avatar_url
                  }
                />
                <AvatarFallback className="text-[8px]">OM</AvatarFallback>
              </Avatar>
              <p className="text-xs font-medium leading-none space-x-1">
                <span className="group-hover:underline">
                  {arg?.user_data?.name || arg?.users?.data?.name}
                </span>
                <span className="font-normal group-hover:underline">
                  {formatDistance(arg.created_at, new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </p>
            </Link>
          </CardFooter>
        </Card>
        <DialogPortal forceMount>
          <DialogContent>{Forms[dialog]}</DialogContent>
        </DialogPortal>
      </Dialog>
      <ConfirmationDialog />
    </>
  );
};

export default memo(
  CounterCard,
  (prevProps, nextProps) =>
    JSON.stringify(prevProps) === JSON.stringify(nextProps)
);

const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};
const ViewLink = ({ link }) => {
  const { data, error, isLoading } = useSWR(link, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (isLoading)
    return (
      <div className="p-3">
        <Skeleton className="h-9" />
        <Skeleton className="h-4 mt-2" />
        <Skeleton className="h-4 mt-2" />
        <Skeleton className="h-4 mt-2" />
      </div>
    );
  if (error)
    return (
      <div className="flex gap-2 p-3 items-center ">
        <p className="text-sm">Failed to load</p>
      </div>
    );

  return (
    <>
      {data.thumbnail ? (
        <div className="w-full h-44 relative">
          <Image
            src={data?.thumbnail?.source}
            alt={data?.title}
            fill
            objectFit="cover"
          />
        </div>
      ) : null}
      <div className="flex gap-1 items-center px-3 pt-2">
        <h1 className="text-lg font-medium line-clamp-1 mt-2">{data?.title}</h1>
        <Link
          href={
            data?.content_urls?.desktop?.page ||
            data?.content_urls?.mobile?.page ||
            "#"
          }
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink
            size={16}
            className="text-blue-500 dark:text-blue-400"
          />
        </Link>
      </div>
      <ListCard className="text-sm mx-3 mb-3" maxHeight={"192px"}>
        {data?.extract}
      </ListCard>
    </>
  );
};
