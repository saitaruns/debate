"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BiLinkAlt } from "react-icons/bi";
import Link from "next/link";
import { formatDistance } from "date-fns";
import useSWRInfinite from "swr/infinite";
import { createClient } from "@/utils/supabase/client";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const supabase = createClient();

const PAGE_SIZE = 2;

const ArgumentsTable = ({ user, count, type }) => {
  const ref = useRef(null);
  const fetcher = async ([key, page]) => {
    console.log("key", key);
    console.log(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
    const query = supabase
      .from("Argument")
      .select(
        "*, users!public_Argument_user_id_fkey(*), votes:public_ArgVoteUserMap_arg_id_fkey(*), fallacies:public_ArgFallacyMap_arg_id_fkey(id, Fallacies(*))",
        {
          count: "exact",
        }
      )
      .eq("user_id", user.id);

    if (type === "counter") {
      query.not("counter_to", "is", null);
    }

    if (type === "support") {
      query.not("support_to", "is", null);
    }

    if (type === "main") {
      query.neq("title", null);
    }

    const { data, count, error } = await query
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)
      .order("created_at", { ascending: false })
      .then((res) => {
        return {
          ...res,
          data: res?.data?.map((arg) => {
            arg.fallacies = arg.fallacies.map((fallacy) => fallacy.Fallacies);
            return arg;
          }),
        };
      });

    if (error) {
      throw new Error("Error fetching notifications");
    }

    return data;
  };

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && previousPageData.length === 0) return null;
    return [`${type}_${user.id}`, String(pageIndex)];
  };

  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite(getKey, fetcher, {
      revalidateFirstPage: false,
      dedupingInterval: 0,
    });

  const isLoadingMore = isLoading || isValidating;
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  if (error) {
    console.error("Error fetching notifications", error);
  }

  const argumts = useMemo(() => {
    return data ? data.flat() : [];
  }, [data]);

  console.log("argumts", argumts);

  useEffect(() => {
    if (ref.current) {
      const scrollHeight = ref.current.scrollHeight;
      ref.current.scroll({
        top: scrollHeight,
      });
    }
  }, [size]);

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>
            {type === "main"
              ? "Main Arguments"
              : type === "counter"
              ? "Counter Arguments"
              : "Support Arguments"}
          </CardTitle>
          <CardDescription>
            {type === "main"
              ? `Arguments that ${user.name}  have created`
              : type === "counter"
              ? `Counter arguments that ${user.name} have created`
              : `Support arguments that ${user.name} have created`}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground float-right">
          {argumts.length} of {count || 0}{" "}
          {type === "main"
            ? `Arguments`
            : type === "counter"
            ? `Counter arguments`
            : `Support arguments`}
        </p>
        <Table ref={ref}>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead>Argument</TableHead>
              <TableHead className=" sm:table-cell">Fallacies</TableHead>
              <TableHead className="text-right">Counters</TableHead>
              <TableHead className="text-right">Upvotes</TableHead>
              <TableHead className="">Downvotes</TableHead>
              <TableHead className="">Date</TableHead>
              <TableHead className="">Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoadingMore && argumts.length <= 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No arguments found
                </TableCell>
              </TableRow>
            ) : null}
            {argumts?.map((arg) => (
              <TableRow key={arg.id} className="odd:bg-white even:bg-muted">
                <TableCell>
                  <Link
                    className="line-clamp-1 overflow-hidden break-all"
                    href={`/arg/${arg.related_to}/?arg=${arg.id}`}
                  >
                    {arg?.title?.slice(0, 14) || arg?.argument?.slice(0, 14)}{" "}
                    ...
                  </Link>
                </TableCell>
                <TableCell className="">{arg?.fallacies?.length}</TableCell>
                <TableCell className="">{arg?.counters || 2}</TableCell>
                <TableCell className="">{arg?.up_votes}</TableCell>
                <TableCell className="">{arg?.down_votes}</TableCell>
                <TableCell className=" truncate">
                  {formatDistance(arg.created_at, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="">
                  <Link href={`/arg/${arg.related_to}/?arg=${arg.id}`}>
                    <BiLinkAlt className="size-3" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {isLoadingMore ? (
              <>
                {[...Array(Math.min(PAGE_SIZE, 3)).keys()].map((i) => (
                  <TableRow key={i}>
                    {[...Array(7).keys()].map((i) => (
                      <TableCell key={i}>
                        <Skeleton className="w-full h-5" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : null}
          </TableBody>
        </Table>
        {!isReachingEnd ? (
          <Button
            className="w-full mt-1"
            variant="ghost"
            onClick={() => setSize(size + 1)}
          >
            <span className="flex items-center gap-1">
              <span>Show more</span>
              {isLoadingMore ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
            </span>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ArgumentsTable;
