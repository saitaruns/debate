"use client";

import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { FaShieldAlt } from "react-icons/fa";
import ReadMore from "../ReadMore";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
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
  Edit,
  ExternalLink,
  Link2,
  LucideSword,
} from "lucide-react";
import { formatDistance } from "date-fns";
import { DialogPortal } from "@radix-ui/react-dialog";
import { createClient } from "@/utils/supabase/client";
import { FORM_TYPE, variantReturner } from "../../constants";
import useSWR from "swr";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Skeleton } from "../ui/skeleton";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import ListCard from "../ListCard";
import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import { AuthContext } from "../AuthContext";
import { useSearchParams } from "next/navigation";
import { handleFocusCard } from "@/utils/focusCard";

const Dialogs = {
  reportFormDialog: "reportForm",
  editFormDialog: "editForm",
};

const supabase = createClient();

const CounterCard = ({ arg, addToArgus, showForm, className }) => {
  const [voteState, setVoteState] = useState(
    arg?.voted === "upvoted" ? 1 : arg?.voted === "downvoted" ? -1 : 0
  );
  const [voteCount, setVoteCount] = useState(arg.up_votes - arg.down_votes);
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const user = useContext(AuthContext);
  const [loginDialog, setLoginDialog] = useState(false);

  const [ConfirmationDialog, confirm] = useConfirm();
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const searchParams = useSearchParams();

  const handleVote = async (vote) => {
    const {
      data: [{ Argument: new_arg }],
      error,
    } = await supabase
      .from("ArgVoteUserMap")
      .upsert({
        arg_id: arg.id,
        type: vote,
      })
      .select("arg_id, Argument(*)");

    if (error) {
      console.error("Error updating argument", error);
    }
  };

  const upVote = () => {
    if (!user) {
      setLoginDialog(true);
      return;
    }
    if (voteState === 0) {
      setVoteState(1);
      setVoteCount((v) => v + 1);
      toast.promise(() => handleVote("upvote"), {
        loading: "Upvoting...",
        success: "You have upvoted this argument",
        error: "Error upvoting argument",
      });
    }
    if (voteState === 1) {
      setVoteState(0);
      setVoteCount((v) => v - 1);
      toast.promise(() => handleVote("novote"), {
        loading: "Removing upvote...",
        success: "You have removed your upvote",
        error: "Error removing upvote",
      });
    }
    if (voteState === -1) {
      setVoteState(1);
      setVoteCount((v) => v + 2);
      toast.promise(() => handleVote("upvote"), {
        loading: "Upvoting...",
        success: "You have upvoted this argument",
        error: "Error upvoting argument",
      });
    }
  };

  const downVote = () => {
    if (!user) {
      setLoginDialog(true);
      return;
    }

    if (voteState === 0) {
      setVoteState(-1);
      setVoteCount((v) => v - 1);
      toast.promise(() => handleVote("downvote"), {
        loading: "Downvoting...",
        success: "You have downvoted this argument",
        error: "Error downvoting argument",
      });
    }
    if (voteState === -1) {
      setVoteState(0);
      setVoteCount((v) => v + 1);
      toast.promise(() => handleVote("novote"), {
        loading: "Removing downvote...",
        success: "You have removed your downvote",
        error: "Error removing downvote",
      });
    }
    if (voteState === 1) {
      setVoteState(-1);
      setVoteCount((v) => v - 2);
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
      const close = await confirm({
        title: "Discard changes?",
        message: "Are you sure you want to discard your changes?",
        actionBtnMessage: "Discard",
      });
      if (close) {
        setOpen(false);
      }
    } else {
      setOpen(true);
    }
  };

  const Forms = {
    editForm: (
      <ArgumentForm
        arg={arg}
        closeDialog={() => setOpen(false)}
        isEdit
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
            "relative my-2  hover:opacity-100 transition-all delay-200",
            {
              "border-l-4 border-green-700": searchParams.has("arg", arg.id),
              // "opacity-55": voteCount < -10,
            },
            className
          )}
          id={`#arg_${arg.id}`}
        >
          <CardContent className="flex p-3 pt-6 pb-0 items-start relative">
            <Badge
              variant="shad"
              className="mb-2 absolute -top-2 right-1 bg-background select-none"
              onClick={() => {
                copyToClipboard(
                  location.host + location.pathname + `?arg=${arg.id}`
                );
                toast("Link copied to clipboard", {
                  type: "success",
                });
              }}
            >
              #{arg.id}
            </Badge>
            <div className="flex flex-col pr-2 items-center">
              <ArrowBigUp
                size={24}
                strokeWidth={1}
                className={cn(
                  "cursor-pointer",
                  "transition-all active:-translate-y-[0.75px]",
                  {
                    "fill-primary stroke-primary": voteState === 1,
                  }
                )}
                onClick={upVote}
              />
              <span
                className={cn("text-sm font-semibold", "transition-all", {
                  "text-primary": voteCount > 0,
                  "text-destructive": voteCount < 0,
                })}
              >
                {voteCount}
              </span>
              <ArrowBigDown
                size={24}
                strokeWidth={1}
                className={cn(
                  "cursor-pointer",
                  "transition-all active:translate-y-[0.75px]",
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
                    variant="shad"
                    className="cursor-pointer"
                    onClick={() => {
                      handleFocusCard(`#arg_${arg.counter_to}`);
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
                    variant="shad"
                    className="cursor-pointer"
                    onClick={() => {
                      handleFocusCard(`#arg_${arg.support_to}`);
                    }}
                  >
                    #{arg?.support_to}
                  </Badge>
                </div>
              ) : null}
              <ReadMore minLines={3} className="mb-3">
                {arg?.argument}
              </ReadMore>
              <div className="mt-2 w-11/12">
                {arg?.fallacies?.map((fallacy) => (
                  <Popover key={fallacy.id}>
                    <PopoverTrigger>
                      <Badge
                        variant={variantReturner(fallacy.name)}
                        className="m-1 ml-0 cursor-pointer divide-x"
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
                    onClick={() =>
                      showForm({
                        [FORM_TYPE.COUNTER]: true,
                        argId: arg.id,
                      })
                    }
                  >
                    <LucideSword size={16} /> Counter
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    onClick={() =>
                      showForm({
                        [FORM_TYPE.SUPPORT]: true,
                        argId: arg.id,
                      })
                    }
                  >
                    <FaShieldAlt size={16} /> Defend
                  </DropdownMenuItem>
                  {arg?.user_id === user?.id ? (
                    <DialogTrigger
                      asChild
                      onClick={() => openDialog(Dialogs.editFormDialog)}
                    >
                      <DropdownMenuItem className="cursor-pointer gap-2">
                        <Edit size={16} />
                        Edit
                      </DropdownMenuItem>
                    </DialogTrigger>
                  ) : null}
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    onClick={() => {
                      copyToClipboard(
                        location.host + location.pathname + `?arg=${arg.id}`
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
      <Dialog open={loginDialog} onOpenChange={setLoginDialog}>
        <DialogContent>
          <DialogHeader>Login Required</DialogHeader>
          <div className="flex flex-col gap-10">
            <h2 className="text-md text-muted-foreground ">
              Please login to your account to post an argument
            </h2>
            <div className="mt-4 flex justify-end gap-2 flex-col-reverse sm:flex-row">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Link href="/auth/login" className={cn(buttonVariants({}))}>
                Login
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
export const ViewLink = ({ link }) => {
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
        <div className="w-full h-44 relative rounded-xl">
          <Image
            src={data?.thumbnail?.source}
            alt={data?.title}
            fill
            className="rounded-t-xl"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      ) : null}
      <div className="flex gap-1 items-center px-3 pt-2">
        <h1 className="text-lg font-medium line-clamp-1">{data?.title}</h1>
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
