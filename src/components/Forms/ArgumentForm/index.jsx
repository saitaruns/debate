"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsInfoCircle } from "react-icons/bs";
import { toast } from "sonner";
import { z } from "zod";
import useConfirm from "@/hooks/useConfirm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "@/utils/supabase/client";
import { AuthContext } from "@/components/AuthContext";
import Link from "next/link";
import { DialogClose } from "@radix-ui/react-dialog";
import TipTap from "@/components/TipTap";

const MAX_ARG_LENGTH = 500;
const MIN_ARG_LENGTH = 50;

const supabase = createClient();

const ArgumentForm = ({
  arg = {},
  isEdit,
  closeDialog = () => {},
  addToArgus = () => {},
}) => {
  const [links, setLinks] = useState([]);
  const [fallacies, setFallacies] = useState([]);
  const [argStrength, setArgStrength] = useState(0);
  const user = useContext(AuthContext);

  const [ConfirmationDialog, confirm] = useConfirm();

  const isTitle = !isEdit || arg.title;

  const argFormSchema = z.object({
    ...(isTitle && {
      title: z.string().min(5, "Title must be at least 5 characters long"),
    }),
    arg: z.object({
      content: z.string(),
      count: z
        .number()
        .min(
          MIN_ARG_LENGTH,
          `Argument must be at least ${MIN_ARG_LENGTH}  characters long`
        )
        .max(
          MAX_ARG_LENGTH,
          `Argument must be at most ${MAX_ARG_LENGTH} characters long`
        ),
    }),
  });

  const argForm = useForm({
    resolver: zodResolver(argFormSchema),
    defaultValues: {
      title: arg?.title || null,
      arg: arg?.argument || { count: 0 },
    },
  });

  const argLength = argForm.watch("arg").count;

  useEffect(() => {
    const argStrength = Math.min(
      Math.floor((argLength / MAX_ARG_LENGTH) * 100),
      100
    );

    setArgStrength(argStrength);
  }, [argLength]);

  const handlePost = async (data) => {
    const {
      data: [newArg],
      error,
    } = await supabase
      .from("Argument")
      .upsert([
        {
          ...(isEdit && { id: arg.id }),
          title: data.title,
          argument: data.arg.content,
        },
      ])
      .select("*, users!public_Argument_user_id_fkey(*)");

    let fallacyData = [];
    if (!error) {
      const fas =
        fallacies?.reduce((acc, { id }) => {
          if (acc.findIndex((item) => item.fallacy_id === id) === -1) {
            acc.push({
              arg_id: arg?.counter_to || arg?.support_to,
              fallacy_id: id,
            });
          }
          return acc;
        }, []) || [];
      const { data: fData, error: fallacyError } = await supabase
        .from("ArgFallacyMap")
        .upsert(fas)
        .select("*, Fallacies(*)");
      if (fallacyError) {
        console.error(fallacyError);
      } else {
        fallacyData = fData;
      }
    }

    addToArgus({
      arg: {
        ...newArg,
      },
      fallacies: fallacyData,
    });
    if (error) {
      console.error("Error creating argument", error);
    }
    argForm.reset();
  };

  const onArgumentSubmit = async (data) => {
    const ans = await confirm({
      title: "Post Argument",
      message: "Are you sure you want to post this argument?",
      actionBtnMessage: "Post",
    });

    if (ans) {
      toast.promise(() => handlePost(data), {
        loading: "Posting your Argument",
        success: "Argument posted",
        error: "Failed to post your argument",
      });
      closeDialog();
    }
  };

  const handleCancel = async () => {
    const ans = await confirm({
      title: "Discard changes?",
      message: "Are you sure you want to discard your changes?",
      actionBtnMessage: "Discard",
    });
    if (ans) closeDialog();
  };

  const handleSetDetails = ({ links, fallacies }) => {
    setLinks(links);
    setFallacies(fallacies);
  };

  if (!user) {
    return (
      <>
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
      </>
    );
  }

  return (
    <Form {...argForm}>
      <form
        onSubmit={argForm.handleSubmit(onArgumentSubmit)}
        className={cn("lg:max-w-lg")}
      >
        <DialogHeader className="mb-3">
          <DialogTitle>{isEdit ? "Edit Argument" : "New Argument"}</DialogTitle>
          <DialogDescription>
            Make your argument with good explanation and reliable evidence.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 mt-3">
          {isTitle && (
            <FormField
              control={argForm.control}
              name="title"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={argForm.control}
            name="arg"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex w-full justify-between">
                  <span>{isEdit ? "Edit Argument" : "Argument"}</span>
                  <span>
                    {argLength}/{MAX_ARG_LENGTH}
                  </span>
                </FormLabel>
                <FormControl>
                  <TipTap
                    value={field.value}
                    className="border rounded-md p-2"
                    handleSetDetails={handleSetDetails}
                    {...field}
                  />
                </FormControl>
                {argForm.formState.errors.arg?.count && (
                  <p className="ml-4 text-sm font-medium text-destructive">
                    {argForm.formState.errors.arg?.count.message}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>
        <DialogFooter className="mt-4 flex-col space-y-3 sm:flex-row sm:items-end">
          <Popover>
            <div className="space-y-3 flex-1">
              <p className="text-sm font-medium flex gap-1">
                <span>Argument Strength</span>
                <PopoverTrigger>
                  <BsInfoCircle className="cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent align="center" side="right">
                  <p className="text-xs sm:text-sm">
                    The strength of your argument is determined by the length of
                    your argument and the number of evidence you provide.
                  </p>
                </PopoverContent>
              </p>
              <Progress
                value={argStrength}
                max={100}
                className={cn("h-2", {
                  "[&>*]:bg-red-600": argStrength < 40,
                  "[&>*]:bg-yellow-600": argStrength > 60,
                  "[&>*]:bg-green-600": argStrength > 80,
                })}
              />
            </div>
          </Popover>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="m-0">
              Post
            </Button>
          </div>
        </DialogFooter>
        <ConfirmationDialog />
      </form>
    </Form>
  );
};

export default ArgumentForm;
