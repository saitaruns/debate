"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const REPORT_ITEMS = [
  {
    id: "hatespeech",
    label: "Hate Speech",
  },
  {
    id: "harassment",
    label: "Harassment",
  },
  {
    id: "violence",
    label: "Violence",
  },
  {
    id: "spam",
    label: "Spam",
  },
  {
    id: "misinformation",
    label: "Misinformation",
  },
  {
    id: "other",
    label: "Other",
  },
];

const ReportForm = ({closeDialog}) => {
  const reportFormSchema = z.object({
    items: z.array(z.string()).nonempty({
      message: "You must select at least one report reason",
    }),
  });

  const reportForm = useForm({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      items: [],
    },
  });

  const onReportSubmit = (data) => {
    toast.promise(() => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 2000)),{
      loading: 'Reporting...',
      success: 'Reported!',
      error: 'Failed to report'
    })
    closeDialog()
  };

  return (
    <Form {...reportForm}>
      <form onSubmit={reportForm.handleSubmit(onReportSubmit)}>
        <DialogHeader>
          <DialogTitle>Report</DialogTitle>
          <DialogDescription>
            Report this argument for violating the community guidelines.
          </DialogDescription>
        </DialogHeader>
        <FormField
          control={reportForm.control}
          name="items"
          render={() => (
            <FormItem>
              {REPORT_ITEMS.map((item) => (
                <FormField
                  key={item.id}
                  control={reportForm.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0 mt-4"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(field.value?.filter((value) => value !== item.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Report</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ReportForm;
