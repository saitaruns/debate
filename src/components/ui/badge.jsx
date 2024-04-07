import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs  transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border border-foreground text-foreground",
        relevance:
          "border border-red-600 bg-red-100 text-red-600 divide-red-600 dark:bg-red-600 dark:text-red-100 dark:divide-red-100",
        presumption:
          "border border-yellow-600 bg-yellow-100 text-yellow-600 divide-yellow-600 dark:bg-yellow-600 dark:text-yellow-100 dark:divide-yellow-100",
        causal:
          "border border-blue-600 bg-blue-100 text-blue-600 divide-blue-600 dark:bg-blue-600 dark:text-blue-100 dark:divide-blue-100",
        appeal:
          "border border-green-600 bg-green-100 text-green-600 divide-green-600 dark:bg-green-600 dark:text-green-100 dark:divide-green-100",
        structure:
          "border border-purple-600 bg-purple-100 text-purple-600 divide-purple-600 dark:bg-purple-600 dark:text-purple-100 dark:divide-purple-100",
        other:
          "border border-gray-600 bg-gray-100 text-gray-600 divide-gray-600 dark:bg-gray-600 dark:text-gray-100dark:divide-gray-100",
        shad: "shadow-sm cursor-pointer  active:shadow-inner",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
