"use client";

import React, { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Card, CardContent, CardFooter } from "../ui/card";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import ReadMore from "../ReadMore";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { BiSolidCommentX } from "react-icons/bi";
import { MdReport } from "react-icons/md";
import ReportForm from "../Forms/ReportForm";
import CounterForm from "../Forms/CounterForm";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import useConfirm from "@/hooks/useConfirm";

const Dialogs = {
  counterFormDialog: 'counterForm',
  reportFormDialog: 'reportForm'
}

const Forms = {
  "counterForm": CounterForm,
  "reportForm" : ReportForm,
}

const CounterCard = ({ arg }) => {
  const [voteState, setVoteState] = useState(0);
  const [voteCount, setVoteCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(null)
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
    setOpen(true)
    setDialog(dialog)
  }

  const Form = Forms[dialog]

  return (
    <>
    <Dialog open={open} onOpenChange={async (value)=>{
      if(!value){
        const close = await confirm()
        if(close){
          setOpen(false)
        }
      }
      else{
        setOpen(true)
      }
    }}>
      <HoverCard openDelay="10" closeDelay="0">
        <Card className="m-1 relative">
          <CardContent className="flex p-3 pt-6 pb-0">
            <div className="flex flex-col pr-2 items-center">
              <FaAngleUp size={24} className="cursor-pointer" onClick={upVote} />
              <div className="text-sm">{voteCount}</div>
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
              <ReadMore minLines={3} className="mb-3">{arg.content}</ReadMore>
              <ul>
              {arg.evidence.map((evidence) => (
                <li key={evidence.id}>
                  <Link href={evidence.link} target="_blank" className="font-normal text-xs sm:text-sm w-fit text-blue-700 dark:text-blue-500 hover:underline hover:after:content-['_↗']">
                    <span>{evidence.description}</span>
                  </Link>
                </li>
              ))}
              </ul>
              <div className="mt-2">
                {arg.fallacies.map((fallacy) => (
                  <Badge key={fallacy.id} className="mr-1 cursor-pointer dark:bg-slate-400">
                    {fallacy.name}
                  </Badge>
                ))}
              </div>
            </div>
            <HoverCardTrigger>
              <div className="absolute right-0 top-0 p-8 h-full rounded-sm"></div>
            </HoverCardTrigger>
          </CardContent>
          <CardFooter className="flex justify-end mt-3">
            <div className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src="/avatars/01.png" />
                <AvatarFallback className="text-[8px]">OM</AvatarFallback>
              </Avatar>
              <p className="text-xs font-medium leading-none">
                Sofia Davis <span className="font-normal">posted 5 days ago</span>
              </p>
            </div>
          </CardFooter>
        </Card>
        <HoverCardContent
          side="right"
          sideOffset={-10}
          className="bg-transparent shadow-none flex flex-col gap-2 cursor-pointer w-fit h-fit items-start p-2 border-none"
        >
            <DialogTrigger onClick={()=>openDialog(Dialogs.counterFormDialog)}>
              <div className="shadow-md hover:shadow-lg active:shadow-md p-3 rounded-full bg-blue-300 hover:after:content-['Counter'] hover:after:ml-1 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white">
                <BiSolidCommentX size={24} className="inline" />
              </div>
            </DialogTrigger>
            <DialogTrigger onClick={()=>openDialog(Dialogs.reportFormDialog)}>
              <div className="shadow-md hover:shadow-lg active:shadow-md p-3 rounded-full bg-red-300 dark:bg-red-700 hover:after:content-['Report'] hover:after:ml-1">
                <MdReport size={24} className="inline" />
              </div>
            </DialogTrigger>
        </HoverCardContent>
      </HoverCard>
      <DialogContent
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        className={cn(dialog === Dialogs.counterFormDialog && "lg:min-w-[700px]")}
      >
        <Form arg={arg} closeDialog={()=>setOpen(false)} />
      </DialogContent>
    </Dialog>
    <ConfirmationDialog />
    </>
  );
};

export default CounterCard;
