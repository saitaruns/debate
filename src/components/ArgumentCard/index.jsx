import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { HiDotsVertical } from "react-icons/hi";
import { formatDistance } from "date-fns";
import { cn } from "@/lib/utils";
import { variantReturner } from "@/constants";
import Link from "next/link";
import { TextGenerateEffect } from "../ui/text-generate-effect";

const ArgumentCard = ({ className, ...arg }) => {
  return (
    <Card
      key={arg.id}
      className={cn(
        "relative my-2 shadow-md hover:shadow-lg transition-all w-11/12",
        className
      )}
      id={`#arg_${arg.id}`}
    >
      <CardContent className="flex p-3 pt-6 pb-0 items-start relative">
        <Badge
          variant="shad"
          className="mb-2 absolute -top-2 right-1 bg-background select-none"
        >
          #{arg.id}
        </Badge>
        <div className="flex flex-col pr-2 items-center">
          <ArrowBigUp
            size={24}
            strokeWidth={1}
            className={cn(
              "cursor-pointer",
              "transition-all active:-translate-y-[0.75px]"
            )}
          />
          <span className={cn("text-sm font-semibold", "transition-all")}>
            {arg?.votes}
          </span>
          <ArrowBigDown
            size={24}
            strokeWidth={1}
            className={cn(
              "cursor-pointer",
              "transition-all active:translate-y-[0.75px]"
            )}
          />
        </div>
        <div className="flex flex-col flex-1">
          {arg?.counter_to ? (
            <div className="text-xs text-slate-500">
              countering{" "}
              <Badge variant="shad" className="cursor-pointer">
                #{arg?.counter_to}
              </Badge>
            </div>
          ) : null}
          {arg?.support_to ? (
            <div className="text-xs text-slate-500">
              supporting{" "}
              <Badge variant="shad" className="cursor-pointer">
                #{arg?.support_to}
              </Badge>
            </div>
          ) : null}
          <p className="mb-3 mt-1">{arg?.argument}</p>
          <ul className="">
            {arg?.evidence?.map((evidence) => {
              return (
                <li key={evidence.source} className="truncate break-all w-full">
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
              <Badge
                key={fallacy.name}
                variant={variantReturner(fallacy.name)}
                className="m-1 ml-0 cursor-pointer divide-x"
              >
                <span className="text-xs pr-1">{fallacy?.name}</span>
                <span className={cn("text-xs pl-1")}>{fallacy?.count}</span>
              </Badge>
            ))}
          </div>
        </div>
        <HiDotsVertical className="" />
      </CardContent>
      <CardFooter className="flex justify-end mt-3">
        <Link href="#" className="flex items-center space-x-2 group">
          <Avatar className="size-4">
            <AvatarImage />
            <AvatarFallback className="text-[8px]">OM</AvatarFallback>
          </Avatar>
          <p className="text-xs font-medium leading-none space-x-1">
            <span className="group-hover:underline">
              {arg?.user_data?.name || arg?.users?.data?.name}
            </span>
            <span className="hidden sm:inline-block font-normal group-hover:underline">
              {formatDistance(arg.created_at, new Date(), {
                addSuffix: true,
              })}
            </span>
          </p>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArgumentCard;
