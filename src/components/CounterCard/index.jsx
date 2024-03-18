"use client";

import React, { useState } from "react";
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
import { CgMailReply } from "react-icons/cg";
import { MdOutlineReportProblem } from "react-icons/md";
import { LucideSword } from "lucide-react";

const Dialogs = {
  counterFormDialog: "counterForm",
  reportFormDialog: "reportForm",
};

const CounterCard = ({ arg }) => {
  const [voteState, setVoteState] = useState(0);
  const [voteCount, setVoteCount] = useState(56);
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action cannot be undone",
    "Close"
  );

  const upVote = () => {
    if (voteState !== 1) {
      setVoteState((prev) => prev + 1);
      setVoteCount(voteCount + 1);
      toast("You have upvoted this argument", { type: "success" });
    }
  };

  const downVote = () => {
    if (voteState !== -1) {
      setVoteState((prev) => prev - 1);
      setVoteCount(voteCount - 1);
      toast("You have downvoted this argument", { type: "success" });
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
    counterForm: (
      <ArgumentForm arg={arg} closeDialog={() => setOpen(false)} isCounter />
    ),
    reportForm: <ReportForm closeDialog={() => setOpen(false)} />,
  };

  return (
    <>
      <Dialog open={open} onOpenChange={toggleDialog}>
        <DropdownMenu>
          <Card className="relative mb-1">
            <CardContent className="flex p-3 pt-6 pb-0 items-start">
              <div className="flex flex-col pr-2 items-center">
                <FaAngleUp
                  size={24}
                  className="cursor-pointer"
                  onClick={upVote}
                />
                <FancyNumber number={voteCount} className="text-sm" />
                <FaAngleDown
                  size={24}
                  className="cursor-pointer"
                  onClick={downVote}
                />
              </div>
              <div className="flex flex-col flex-1">
                <div className="text-xs text-slate-500">
                  countering <span className="text-slate-700">@outsmart</span>
                </div>
                <ReadMore minLines={3} className="mb-3">
                  {arg.content}
                </ReadMore>
                <ul>
                  {arg.evidence.map((evidence) => (
                    <li key={evidence.id}>
                      <Link
                        href={evidence.link}
                        target="_blank"
                        className="font-normal text-xs sm:text-sm w-fit text-blue-700 dark:text-blue-500 hover:underline hover:after:content-['_↗']"
                      >
                        <span>{evidence.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  {arg.fallacies.map((fallacy) => (
                    <Badge
                      key={fallacy.id}
                      className="mr-1 cursor-pointer dark:bg-slate-400"
                    >
                      {fallacy.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <DropdownMenuTrigger>
                <HiDotsVertical className="" />
              </DropdownMenuTrigger>
            </CardContent>
            <CardFooter className="flex justify-end mt-3">
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-[8px]">OM</AvatarFallback>
                </Avatar>
                <p className="text-xs font-medium leading-none">
                  Sofia Davis{" "}
                  <span className="font-normal">posted 5 days ago</span>
                </p>
              </div>
            </CardFooter>
          </Card>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <FaShieldAlt size={16} /> Defend
              </DropdownMenuItem>
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
      </Dialog>
      <ConfirmationDialog />
    </>
  );
};

export default CounterCard;
