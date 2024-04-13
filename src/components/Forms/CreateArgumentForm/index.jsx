"use client";

import TipTap from "@/components/TipTap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FORM_TYPE } from "@/constants";
import useConfirm from "@/hooks/useConfirm";
import { cn } from "@/lib/utils";
import { handleFocusCard } from "@/utils/focusCard";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const MAX_ARG_LENGTH = 500;
const MIN_ARG_LENGTH = 50;
const supabase = createClient();

const argFormSchema = z.object({
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

const CreateArgumentForm = ({
  setShowForm,
  type,
  argId,
  addToArgus,
  className,
}) => {
  const limit = 500;

  const [ConfirmationDialog, confirm] = useConfirm();

  const argForm = useForm({
    resolver: zodResolver(argFormSchema),
    defaultValues: {
      arg: {
        content: "",
        count: 0,
      },
    },
  });

  const handlePost = async (data) => {
    const payload = {
      argument: data.arg.content,
      ...(type === FORM_TYPE.COUNTER && { counter_to: argId }),
      ...(type === FORM_TYPE.SUPPORT && { support_to: argId }),
    };
    const {
      data: [newArg],
      error,
    } = await supabase
      .from("Argument")
      .upsert([payload])
      .select("*, users!public_Argument_user_id_fkey(*)");

    addToArgus({
      arg: {
        ...newArg,
      },
    });

    if (error) {
      console.error("Error creating argument", error);
    }

    argForm.reset();

    flushSync(() => {
      setShowForm({ [type]: false, argId: null });
    });

    handleFocusCard(`#arg_${newArg.id}`);
  };

  const handleCancel = async () => {
    let res = true;
    const isDirty = Object.keys(argForm.formState.dirtyFields).length > 0;

    if (isDirty) {
      res = await confirm({
        title: "Discard changes?",
        message: "Are you sure you want to discard your changes?",
        actionBtnMessage: "Discard",
      });
    }
    if (res) {
      argForm.reset();
      setShowForm({ [type]: false, argId: null });
    }
  };

  const onArgumentSubmit = async (data) => {
    const ans = await confirm({
      title: "Post Argument?",
      message: "Are you sure you want to post this argument?",
      actionBtnMessage: "Post",
    });

    if (ans) {
      toast.promise(() => handlePost(data), {
        loading: "Posting your Argument",
        success: "Argument posted",
        error: "Failed to post your argument",
      });

      argForm.reset();
      setShowForm({ [type]: false, argId: null });

      handleFocusCard(`#arg_${argId}`);
    }
  };

  const charCount = argForm.watch("arg").count;

  const percentage = Math.round((100 / limit) * charCount);

  return (
    <Card className={cn("pb-2 px-1 mb-4", className)}>
      <Form {...argForm}>
        <form onSubmit={argForm.handleSubmit(onArgumentSubmit)}>
          {argId ? (
            <div className="text-xs text-slate-500 px-4 pt-3 mb-2">
              {
                {
                  [FORM_TYPE.COUNTER]: "countering argument",
                  [FORM_TYPE.SUPPORT]: "supporting argument",
                }[type]
              }
              <Badge
                variant="shad"
                className="cursor-pointer ml-2"
                onClick={() => {
                  handleFocusCard(`#arg_${argId}`);
                }}
              >
                #{argId}
              </Badge>
            </div>
          ) : null}
          <FormField
            control={argForm.control}
            name="arg"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TipTap
                    value={field.value}
                    className={cn("border rounded-md p-2")}
                    limit={limit}
                    {...field}
                  />
                </FormControl>
                {argForm.formState.errors.arg?.count?.message && (
                  <p className="ml-4 text-sm font-medium text-destructive">
                    {argForm.formState.errors.arg?.count?.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <div className="flex justify-between px-4 pt-2">
            <div
              className={cn(
                "flex items-center gap-2",
                percentage >= 100 && "text-red-500"
              )}
            >
              <svg
                height="20"
                width="20"
                viewBox="0 0 20 20"
                className="w-5 h-5"
              >
                <circle r="10" cx="10" cy="10" fill="#e9ecef" />
                <circle
                  r="5"
                  cx="10"
                  cy="10"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
                  transform="rotate(-90) translate(-20)"
                />
                <circle r="6" cx="10" cy="10" fill="white" />
              </svg>

              <div className="text-xs text-slate-500">
                {charCount}/{limit} characters
              </div>
            </div>
            <div className="space-x-2">
              <Button
                variant="ghost"
                className="text-slate-500"
                size="sm"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <ConfirmationDialog />
    </Card>
  );
};

export default CreateArgumentForm;
