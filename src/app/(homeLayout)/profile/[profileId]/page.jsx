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
import { cookies } from "next/headers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BadgeInfoIcon,
  InfoIcon,
  MessageSquare,
  Rotate3DIcon,
  Tags,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BiLinkAlt } from "react-icons/bi";
import { variantReturner } from "@/constants";
import { cn } from "@/lib/utils";
import ArgumentsTable from "@/components/ProfileTabs/ArgumentsTable";

const Profile = async ({ params: { profileId } }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .rpc("get_profile_data", {
      profile_id: profileId,
    })
    .single();

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
              src={data?.data?.avatar_url}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              {data?.data?.name}
              <p className="text-lg text-muted-foreground font-normal">
                {data?.data?.email}
              </p>
            </h2>
            <div className="text-muted-foreground text-sm">
              <h3>
                Trust Score
                <span className="text-primary ml-1">
                  {data?.trust_score || "0%"}{" "}
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
                title: "MainArguments",
                count: data?.ma_count,
                info: "Total arguments started by user",
              },
              {
                icon: (
                  <Rotate3DIcon className="h-4 w-4 text-muted-foreground" />
                ),
                title: "Counters",
                count: data?.ca_count,
                info: "Total counters by user",
              },
              {
                icon: (
                  <Rotate3DIcon className="h-4 w-4 text-muted-foreground" />
                ),
                title: "Support",
                count: data?.sa_count,
                info: "Total support by user",
              },
            ].map(({ title, count, info, icon }) => (
              <Card key={title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{title}</CardTitle>
                  {icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count || 0}</div>
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
                  <Tags className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription className="">
                  Most common fallacies
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 px-3">
                <div className="">
                  {data?.top_f?.map((fallacy) => (
                    <Badge
                      key={fallacy.id}
                      variant={variantReturner(fallacy.name)}
                      className="m-1 ml-0 cursor-pointer divide-x"
                    >
                      <span className="text-xs pr-1">{fallacy?.name}</span>
                      <span className={cn("text-xs pl-1")}>
                        {fallacy?.count}
                      </span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Tabs defaultValue="main" className="">
              <TabsList>
                <TabsTrigger value="main">Arguments</TabsTrigger>
                <TabsTrigger value="support">Support Arguments</TabsTrigger>
                <TabsTrigger value="counter">Counters</TabsTrigger>
              </TabsList>
              {["main", "support", "counter"].map((tab) => (
                <TabsContent value={tab} key={tab}>
                  <ArgumentsTable
                    user={{
                      id: profileId,
                      ...data?.data,
                    }}
                    count={
                      {
                        main: data?.ma_count,
                        support: data?.sa_count,
                        counter: data?.ca_count,
                      }[tab]
                    }
                    type={tab}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Profile;
