import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FancyNumber from "@/components/Number";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import { Suspense } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import HomeLoading from "./homeloading";

const PAGE_SIZE = 1;

function pagination(c, m) {
  var current = c,
    last = m,
    delta = 2,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= last; i++) {
    if (i == 1 || i == last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

export default async function Home({ searchParams }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  let {
    data: args,
    count,
    error,
  } = await supabase
    .from("Argument")
    .select("*, users!public_Argument_user_id_fkey(*)", {
      count: "exact",
    })
    .neq("title", null)
    .ilike("title", `%${query}%`)
    .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching arguments", error);
  }

  return (
    <div className="flex m-3">
      <div className="w-0 sm:w-2/12" />
      <Suspense key={query + currentPage} fallback={<HomeLoading />}>
        <div className="w-full sm:w-8/12 md:w-6/12 flex-col mt-3 mr-3 space-y-2">
          <p className="m-0 text-xs">{count} argument(s)</p>
          {args?.map((arg) => (
            <Card key={arg.id} className="w-full shadow-md">
              <CardHeader className="p-3">
                <Link href={`/arg/${arg.id}`} className="hover:underline">
                  <CardTitle className="text-md font-medium truncate">
                    {arg?.title}
                  </CardTitle>
                </Link>
                <CardDescription className="text-xs">
                  {arg?.up_votes} up vote(s) | {arg?.down_votes} down vote(s) |{" "}
                  {arg?.count} argument(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="line-clamp-2 text-xs">{arg?.argument}</p>
              </CardContent>
              <CardFooter className="flex justify-between px-4 pb-2">
                <div className="relative flex justify-center gap-1 items-center">
                  <span className="relative flex size-3">
                    <span className="animate-ping absolute inline-flex size-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-full bg-green-500" />
                  </span>
                  <div className="text-xs font-medium mt-[2px] flex items-center">
                    <FancyNumber>{Math.ceil(Math.random() * 10)}</FancyNumber>{" "}
                    <span>
                      mem<span className="hidden sm:inline">bers</span> active
                    </span>
                  </div>
                </div>
                <Link
                  href={`/profile/${arg?.user_id}`}
                  className="flex items-center space-x-1 group"
                >
                  <Avatar className="w-4 h-4">
                    <AvatarImage src={arg?.users?.data?.avatar_url} />
                    <AvatarFallback className="text-[6px]">OM</AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-medium space-x-1 leading-none">
                    <span className="group-hover:underline">
                      {arg?.users?.data?.name}
                    </span>
                    <span className="font-normal hidden sm:inline group-hover:underline">
                      {formatDistanceToNow(arg.created_at, {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="font-normal sm:hidden">
                      {formatDistanceToNowStrict(arg.created_at, {})}
                    </span>
                  </p>
                </Link>
              </CardFooter>
            </Card>
          ))}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={{
                    pathname: "/",
                    query: { ...searchParams, page: currentPage - 1 },
                  }}
                  aria-disabled={currentPage <= 1}
                  tabIndex={currentPage <= 1 ? -1 : undefined}
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
              {pagination(currentPage, Math.ceil(count / PAGE_SIZE)).map(
                (item, i) => (
                  <PaginationItem key={i}>
                    {item === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href={{
                          pathname: "/",
                          query: { ...searchParams, page: item },
                        }}
                        isActive={currentPage === item}
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href={{
                    pathname: "/",
                    query: { ...searchParams, page: currentPage + 1 },
                  }}
                  aria-disabled={currentPage >= Math.ceil(count / PAGE_SIZE)}
                  tabIndex={
                    currentPage >= Math.ceil(count / PAGE_SIZE) ? -1 : undefined
                  }
                  className={
                    currentPage >= Math.ceil(count / PAGE_SIZE)
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Suspense>
    </div>
  );
}
