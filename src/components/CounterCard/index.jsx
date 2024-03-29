"use client";

import React, { memo, useContext, useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { FaAngleDown, FaAngleUp, FaShieldAlt } from "react-icons/fa";
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
import FancyNumber from "../Number";
import { MdOutlineReportProblem } from "react-icons/md";
import { LucideSword } from "lucide-react";
import { formatDistance } from "date-fns";
import { DialogPortal } from "@radix-ui/react-dialog";
import { createClient } from "@/utils/supabase/client";
import { AuthContext } from "../AuthContext";
import {
  variantReturner,
} from "../../constants";

const Dialogs = {
  supportFormDialog: "supportForm",
  counterFormDialog: "counterForm",
  reportFormDialog: "reportForm",
};

const supabase = createClient();

const CounterCard = ({ arg, addToArgus }) => {
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

  console.log(arg);

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
        <Card className="relative mb-1" id={`arg_${arg.id}`}>
          <CardContent className="flex p-3 pt-6 pb-0 items-start">
            <div className="flex flex-col pr-2 items-center">
              <FaAngleUp
                size={24}
                className={cn("cursor-pointer", {
                  "text-green-500": voteState === 1,
                })}
                onClick={upVote}
              />
              {/* <FancyNumber number={Number(voteCount)} className="text-sm" /> */}
              <span>{voteCount}</span>
              <FaAngleDown
                size={24}
                className={cn("cursor-pointer", {
                  "text-red-500": voteState === -1,
                })}
                onClick={downVote}
              />
            </div>
            <div className="flex flex-col flex-1">
              <div className="text-xs text-slate-500">
                countering <span className="text-slate-700">@outsmart</span>
              </div>
              <ReadMore minLines={3} className="mb-3">
                {arg?.argument}
              </ReadMore>
              <ul className="w-32 sm:w-96">
                {arg?.evidence?.map((ev) => {
                  const evidence = JSON.parse(ev);
                  return (
                    <li
                      key={evidence.source}
                      className="truncate break-words w-full"
                    >
                      <Link
                        href={evidence.source}
                        target="_blank"
                        className="font-normal text-xs sm:text-sm  text-blue-700 dark:text-blue-500 hover:underline hover:after:content-['_↗']"
                      >
                        {evidence.source}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2">
                {arg?.fallacies?.map((fallacy) => (
                  <Badge
                    key={fallacy.id}
                    variant={variantReturner(fallacy.name)}
                    className="m-1 cursor-pointer"
                  >
                    {fallacy.name}
                  </Badge>
                ))}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <HiDotsVertical className="" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuGroup>
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
              <Avatar className="w-6 h-6">
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
          <DialogContent
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
            className={cn(
              dialog === Dialogs.counterFormDialog && "lg:min-w-[700px]"
            )}
          >
            {Forms[dialog]}
          </DialogContent>
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
