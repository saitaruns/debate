import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { cookies } from "next/headers";
import { formatDistance } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  BadgeInfoIcon,
  ChevronUp,
  InfoIcon,
  Link2,
  MessageSquare,
  Rotate3DIcon,
  ShieldAlert,
  UsersIcon,
} from "lucide-react";
import { info } from "autoprefixer";
import { Badge } from "@/components/ui/badge";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BiLinkAlt } from "react-icons/bi";
import FancyNumber from "@/components/Number";
import { variantReturner } from "@/constants";
import { Button } from "@/components/ui/button";

const Profile = async ({ params: { profileId } }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, count, error } = await supabase
    .from("Argument")
    .select(
      "*, users!public_Argument_user_id_fkey(*), votes:public_ArgVoteUserMap_arg_id_fkey(*), fallacies:public_ArgFallacyMap_arg_id_fkey(id, Fallacies(*))",
      { count: "exact" }
    )
    .eq("user_id", profileId)
    // .neq("title", null)
    .order("created_at", { ascending: false })
    .range(0, 2)
    .then((res) => {
      return {
        ...res,
        data: res?.data?.map((arg) => {
          arg.fallacies = arg.fallacies.map((fallacy) => fallacy.Fallacies);
          return arg;
        }),
      };
    });

  if (error || !data) {
    return <div>Error</div>;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="w-12/12 sm:11/12 md:w-9/12 space-y-7 p-3 mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 sm:items-center relative">
          <div className="size-44 relative">
            <Image
              alt="Profile Picture"
              src={data?.[0]?.users?.data?.avatar_url}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              {data?.[0]?.users?.data?.name}
              <p className="text-lg text-muted-foreground font-normal">
                {data?.[0]?.users?.data?.email}
              </p>
            </h2>
            <div className="text-muted-foreground text-sm">
              <h3>
                Trust Score
                <span className="text-primary ml-1">
                  {data?.[0]?.users?.data?.trust_score || "100%"}{" "}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3 w-3 text-muted-foreground inline-block cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="w-32">
                      <p>Trust score is calculated based on user activity</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
              </h3>
            </div>
            <div className="">
              {[
                {
                  id: 1,
                  badge: "Counter Master",
                  icon: "🛡️",
                  info: "Most counters",
                },
                {
                  id: 2,
                  badge: "Debate King",
                  icon: "👑",
                  info: "Most arguments",
                },
                {
                  id: 3,
                  badge: "Fallacy Expert",
                  icon: "🔍",
                  info: "Most fallacies",
                },
              ].map(({ id, badge, icon, info }) => (
                <Badge
                  key={id}
                  className="cursor-pointer m-1 space-x-1"
                  variant="outline"
                >
                  <span className="text-primary ">{icon}</span>
                  <span>{badge}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <BadgeInfoIcon className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{info}</p>
                    </TooltipContent>
                  </Tooltip>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="sm:w-3/12 space-y-2">
            {[
              {
                icon: (
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                ),
                title: "Arguments",
                count: count,
                info: "2% from last month",
              },
              {
                icon: (
                  <Rotate3DIcon className="h-4 w-4 text-muted-foreground" />
                ),
                title: "Counters",
                count: 0,
                info: "2% from last month",
              },
              {
                icon: <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />,
                title: "Upvotes",
                count: 0,
                info: "2% from last month",
              },
              {
                icon: (
                  <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
                ),
                title: "Downvotes",
                count: 0,
                info: "2% from last month",
              },
            ].map(({ title, count, info, icon }) => (
              <Card key={title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{title}</CardTitle>
                  {icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground">{info}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="sm:w-9/12 space-y-3">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-xl flex justify-between items-center">
                  <span>Top Fallacies tagged</span>
                  <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription className="">
                  Most common fallacies
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 px-3">
                <div className="">
                  {data?.[0]?.fallacies?.map((fallacy) => (
                    <Badge
                      key={fallacy.id}
                      variant={variantReturner(fallacy.name)}
                      className="m-1 cursor-pointer"
                    >
                      {fallacy.name}
                      <FancyNumber className="ml-2">
                        {fallacy.count || 23}
                      </FancyNumber>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Tabs defaultValue="main" className="">
              <TabsList>
                <TabsTrigger value="main">Recent Arguments</TabsTrigger>
                <TabsTrigger value="counters">Recent Counters</TabsTrigger>
              </TabsList>
              <TabsContent value="main" className="space-y-3">
                <Card className="xl:col-span-2">
                  <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                      <CardTitle>Arguments</CardTitle>
                      <CardDescription>
                        Recent arguments by {data?.[0]?.users?.data?.name}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Argument</TableHead>
                          <TableHead className=" sm:table-cell">
                            Fallacies
                          </TableHead>
                          <TableHead className="text-right">Counters</TableHead>
                          <TableHead className="text-right">Upvotes</TableHead>
                          <TableHead className="">Downvotes</TableHead>
                          <TableHead className="">Date</TableHead>
                          <TableHead className="">Link</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.map((arg) => (
                          <TableRow key={arg.id} className="">
                            <TableCell>
                              <Link
                                className="line-clamp-1 overflow-hidden break-words"
                                href={`/arg/${arg.related_to}/#arg_${arg.id}`}
                              >
                                {arg?.title?.slice(0, 14) ||
                                  arg?.argument?.slice(0, 14)}{" "}
                                ...
                              </Link>
                            </TableCell>
                            <TableCell className="">
                              {arg?.fallacies?.length}
                            </TableCell>
                            <TableCell className="">
                              {arg?.counters || 2}
                            </TableCell>
                            <TableCell className="">{arg?.up_votes}</TableCell>
                            <TableCell className="">
                              {arg?.down_votes}
                            </TableCell>
                            <TableCell className=" truncate">
                              {formatDistance(arg.created_at, new Date(), {
                                addSuffix: true,
                              })}
                            </TableCell>
                            <TableCell className="">
                              <Link
                                href={`/arg/${arg.related_to}/#arg_${arg.id}`}
                              >
                                <BiLinkAlt className="size-3" />
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="counters"></TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Profile;
