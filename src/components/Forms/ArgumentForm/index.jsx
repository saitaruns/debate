"use client";

import ReadMore from "@/components/ReadMore";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import { toast } from "sonner";
import { z } from "zod";
import useConfirm from "@/hooks/useConfirm";
import MultiSelectInput from "@/components/MultiSelectInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "@/utils/supabase/client";

const MAX_EVIDENCE = 5;
const MAX_ARG_LENGTH = 500;
const MIN_ARG_LENGTH = 50;
const MAX_FALLACIES = 4;
const LINK_REGEX = /(https?:\/\/[^\s]+(?:\.[^\s]+)+)/;

const FALLACIES = [
  { label: "Ad Hominem", value: "ad-hominem" },
  { label: "Strawman", value: "strawman" },
  { label: "False Dilemma", value: "false-dilemma" },
  { label: "Slippery Slope", value: "slippery-slope" },
  { label: "Appeal to Authority", value: "appeal-to-authority" },
  { label: "Appeal to Ignorance", value: "appeal-to-ignorance" },
  { label: "Circular Reasoning", value: "circular-reasoning" },
  { label: "Hasty Generalization", value: "hasty-generalization" },
  { label: "Post Hoc Ergo Propter Hoc", value: "post-hoc-ergo-propter-hoc" },
  { label: "Red Herring", value: "red-herring" },
  { label: "Appeal to Emotion", value: "appeal-to-emotion" },
  { label: "Tu Quoque", value: "tu-quoque" },
  { label: "False Cause", value: "false-cause" },
  { label: "Begging the Question", value: "begging-the-question" },
  { label: "Appeal to Nature", value: "appeal-to-nature" },
  { label: "Composition and Division", value: "composition-and-division" },
  { label: "No True Scotsman", value: "no-true-scotsman" },
  { label: "Genetic Fallacy", value: "genetic-fallacy" },
  { label: "Equivocation", value: "equivocation" },
  { label: "Appeal to Tradition", value: "appeal-to-tradition" },
  { label: "Bandwagon Fallacy", value: "bandwagon-fallacy" },
];

const supabase = createClient();

const ArgumentForm = ({
  arg = {},
  closeDialog = () => {},
  isCounter = false,
  isSupport = false,
  addToArgus = () => {},
}) => {
  const [textareaRows, setTextareaRows] = useState(1);
  const [argStrength, setArgStrength] = useState(0);
  const [fallacies, setFallacies] = useState([]); // [1]
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to submit your argument"
  );

  const counterFormSchema = z.object({
    ...(!isCounter && !isSupport ? { title: z.string().min(5) } : {}),
    arg: z
      .string()
      .min(
        MIN_ARG_LENGTH,
        `Argument must be at least ${MIN_ARG_LENGTH}  characters long`
      )
      .max(
        MAX_ARG_LENGTH,
        `Argument must be at most ${MAX_ARG_LENGTH} characters long`
      ),
    evidence: z
      .array(
        z.object({
          source: z.string().refine((value) => LINK_REGEX.test(value), {
            message: "Please enter a valid URL",
          }),
        })
      )
      .max(MAX_EVIDENCE, `You can only add up to ${MAX_EVIDENCE} evidence`)
      .refine((evidence) => {
        const sources = evidence.map((e) => e.source);
        const uniqueSources = [...new Set(sources)];
        return uniqueSources.length === sources.length;
      }, "Evidence must be unique"),
    ...(isCounter
      ? {
          fallacies: z
            .array(z.number())
            .max(
              MAX_FALLACIES,
              `You can only select up to ${MAX_FALLACIES} fallacies`
            ),
        }
      : {}),
  });

  const counterForm = useForm({
    resolver: zodResolver(counterFormSchema),
    defaultValues: {
      ...(!isCounter ? { title: "" } : {}),
      arg: "",
      evidence: [{ source: "" }],
      ...(isCounter ? { fallacies: [] } : {}),
    },
  });

  useEffect(() => {
    const calculateArgStrength = () => {
      const argLength = counterForm.getValues("arg").length || 0;

      const evidenceLength =
        counterForm
          .getValues("evidence")
          .filter((e) => LINK_REGEX.test(e.source.trim()))?.length || 0;

      const fallaciesLength = counterForm.getValues("fallacies")?.length || 0;

      const weight =
        evidenceLength !== 0 ? evidenceLength / (evidenceLength + 1) : 1;

      const argComponent =
        ((isCounter ? 65 : 70) / weight / MAX_ARG_LENGTH) * argLength || 0;
      const evidenceComponent =
        ((isCounter ? 25 : 30) / (1 - weight) / MAX_EVIDENCE) *
          evidenceLength || 0;
      const fallacyComponent = isCounter
        ? (10 / MAX_FALLACIES) * fallaciesLength || 0
        : 0;

      const argStrength =
        weight * argComponent +
        (1 - weight) * evidenceComponent +
        fallacyComponent;

      setArgStrength(argStrength);
    };
    const subscription = counterForm.watch(calculateArgStrength);
    return () => subscription.unsubscribe();
  }, [
    counterForm.watch,
    counterForm.getValues,
    setArgStrength,
    counterForm,
    isCounter,
  ]);

  const { fields, append, remove } = useFieldArray({
    control: counterForm.control,
    name: "evidence",
  });

  const handlePost = async (data) => {
    const {
      data: [newArg],
      error,
    } = await supabase
      .from("Argument")
      .insert([
        {
          ...(!isCounter && !isSupport ? { title: data.title } : {}),
          argument: data.arg,
          evidence: data.evidence,
          ...(isCounter ? { counter_to: arg.id } : {}),
          ...(isSupport ? { support_to: arg.id } : {}),
        },
      ])
      .select("*, users(*)");

    console.log(newArg, error);

    let fallacyData = [];
    if (isCounter && !error) {
      const { data: fData, error: fallacyError } = await supabase
        .from("ArgFallacyMap")
        .insert(
          data?.fallacies.map((f) => ({
            arg_id: arg.id,
            fallacy_id: f,
          }))
        )
        .select("*, Fallacies(*)");

      if (fallacyError) {
        console.error(fallacyError);
      } else {
        console.log(fData);
        fallacyData = fData;
      }
    }

    addToArgus({
      arg: {
        ...newArg,
      },
      fallacies: fallacyData,
    });
  };

  const onCounterArgumentSubmit = async (data) => {
    const ans = await confirm();

    if (ans) {
      toast.promise(() => handlePost(data), {
        loading: "Posting your Argument",
        success: "Argument posted",
        error: "Failed to post your argument",
      });
      closeDialog();
    }
  };

  const shouldShow = () => {
    const evidence = counterForm.getValues("evidence");
    const value = evidence.at(-1)?.source;

    return (
      evidence.length === 0 ||
      (evidence.length < MAX_EVIDENCE && LINK_REGEX.test(value))
    );
  };

  useEffect(() => {
    const getFallacies = async () => {
      const { data: Fallacies, error } = await supabase
        .from("Fallacies")
        .select("*");

      if (error) {
        console.error(error);
      } else {
        const newFallacies = Fallacies.map((f) => {
          return { label: f.name, value: f.id };
        });
        console.log(newFallacies);
        setFallacies(newFallacies);
      }
    };
    if (isCounter && !isSupport) getFallacies();
  }, [isCounter, isSupport]);

  return (
    <Form {...counterForm}>
      <form onSubmit={counterForm.handleSubmit(onCounterArgumentSubmit)}>
        <DialogHeader className="mb-3">
          <DialogTitle>{isCounter ? "Counter" : ""} Argument</DialogTitle>
          <DialogDescription>
            Make your argument with good explanation and reliable evidence.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="overflow-auto max-h-[70vh]">
          <div className="space-y-5 mt-3">
            <ReadMore
              minLines={1}
              className="border-l-4 border-slate-700 p-2 bg-slate-300 dark:bg-slate-800 dark:border-slate-900"
            >
              {arg?.argument}
            </ReadMore>
            {!isCounter && !isSupport ? (
              <FormField
                control={counterForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mx-1">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <FormField
              control={counterForm.control}
              name="arg"
              render={({ field }) => (
                <FormItem className="mx-1">
                  <FormLabel className="flex w-full justify-between">
                    Your Counter Argument
                    <span>
                      {field.value.trim().length}/{MAX_ARG_LENGTH}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your argument"
                      className="resize-none relative max-h-48"
                      coulumn={1}
                      maxLength={MAX_ARG_LENGTH}
                      rows={textareaRows}
                      onChangeCapture={(event) => {
                        const textareaLineHeight = 20;
                        const previousRows = event.target.rows;
                        event.target.rows = 1;
                        const currentRows = Math.ceil(
                          (event.target.scrollHeight - textareaLineHeight) /
                            textareaLineHeight
                        );

                        if (currentRows === previousRows) {
                          event.target.rows = currentRows;
                        }
                        setTextareaRows(currentRows);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={counterForm.control}
              name="evidence"
              render={({ field }) => (
                <FormItem className="mx-1">
                  <FormLabel className="flex w-full justify-between">
                    Evidences
                    <span>
                      {field.value.length}/{MAX_EVIDENCE}
                    </span>
                  </FormLabel>
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={counterForm.control}
                      name={`evidence.${index}.source`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex space-x-1">
                              <Input
                                placeholder="Paste your evidence link"
                                {...field}
                              />
                              <Button
                                size="icon"
                                type="button"
                                variant="ghost"
                                onClick={() => remove(index)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <div className="flex gap-4 items-center">
                    {shouldShow() ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          append({ source: "" });
                        }}
                      >
                        Add
                      </Button>
                    ) : null}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {isCounter ? (
              <FormField
                control={counterForm.control}
                name="fallacies"
                render={({ field }) => (
                  <FormItem className="mx-1 mt-3">
                    <FormLabel>Select relevant fallcies</FormLabel>
                    <FormControl>
                      <MultiSelectInput
                        {...field}
                        options={fallacies}
                        selectedValues={field.value}
                        maxSelected={MAX_FALLACIES}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </div>
        </ScrollArea>
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
          <Button type="submit" className="m-0">
            Post
          </Button>
        </DialogFooter>
        <ConfirmationDialog />
      </form>
    </Form>
  );
};

export default ArgumentForm;
