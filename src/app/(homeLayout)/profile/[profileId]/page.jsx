import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cookies } from "next/headers";
import { formatDistance } from "date-fns";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  appealFallacies,
  causalFallacies,
  otherFallacies,
  presumptionFallacies,
  relevanceFallacies,
  structureFallacies,
} from "@/constants";
import { Badge } from "@/components/ui/badge";

const Profile = async ({ params: { profileId } }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("Argument")
    .select(
      "*, users!public_Argument_user_id_fkey(*), votes:public_ArgVoteUserMap_arg_id_fkey(*), fallacies:public_ArgFallacyMap_arg_id_fkey(id, Fallacies(*))"
    )
    .eq("user_id", profileId)
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
    <div className="flex sm:mt-10">
      <div className="w-0 sm:w-2/12"></div>
      <div className="sm:w-9/12 space-y-5 p-3">
        <div className="flex gap-4 sm:gap-10 items-center">
          <div className="size-16 sm:size-44 rounded-full overflow-hidden relative">
            <Image
              alt="Profile Picture"
              src={data?.[0]?.users?.data?.avatar_url}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">
              {data?.[0]?.users?.data?.name}
            </h2>
            <p className="text-lg">{data?.[0]?.users?.data?.email}</p>
          </div>
        </div>
        <div className="w-full sm:flex">
          <div className="sm:w-3/12"></div>
          <div className="sm:w-7/12">
            <Tabs defaultValue="main" className="w-full">
              <TabsList>
                <TabsTrigger value="main">Recent Arguments</TabsTrigger>
                <TabsTrigger value="counters">Recent Counters</TabsTrigger>
              </TabsList>
              <TabsContent value="main" className="space-y-3">
                {data?.map((arg) => (
                  <Card className="relative shadow-md" key={arg.id}>
                    <CardContent className="flex p-3 pt-6 pb-0 items-start">
                      <div className="flex flex-col pr-2 items-center">
                        <FaAngleUp size={24} className={cn("")} />
                        <span>{arg?.up_votes + arg?.down_votes}</span>
                        <FaAngleDown size={24} className={cn("")} />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="text-xs text-slate-500 flex justify-between mb-2">
                          <span className="text-slate-700">
                            countering @outsmart
                          </span>
                          <span className="font-normal">
                            {formatDistance(arg.created_at, new Date(), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <ReadMore minLines={3} className="mb-3">
                          {arg?.argument}
                        </ReadMore>
                        <ul className="w-32 sm:w-96">
                          {arg?.evidence?.map((ev) => {
                            const evidence = JSON.parse(ev);
                            return (
                              <li
                                key={evidence.source}
                                className="truncate break-words w-full"
                              >
                                <Link
                                  href={evidence.source}
                                  target="_blank"
                                  className="font-normal text-xs sm:text-sm  text-blue-700 dark:text-blue-500 hover:underline hover:after:content-['_↗']"
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
                              key={fallacy.id}
                              variant="outline"
                              className={cn(
                                "mr-1 cursor-pointer dark:bg-slate-400",
                                {
                                  "bg-red-100 text-red-600 dark:bg-red-600 dark:text-red-100":
                                    relevanceFallacies.includes(fallacy.name),
                                  "bg-yellow-100 text-yellow-600 dark:bg-yellow-600 dark:text-yellow-100":
                                    presumptionFallacies.includes(fallacy.name),
                                  "bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-blue-100":
                                    causalFallacies.includes(fallacy.name),
                                  "bg-green-100 text-green-600 dark:bg-green-600 dark:text-green-100":
                                    appealFallacies.includes(fallacy.name),
                                  "bg-purple-100 text-purple-600 dark:bg-purple-600 dark:text-purple-100":
                                    structureFallacies.includes(fallacy.name),
                                  "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-100":
                                    otherFallacies.includes(fallacy.name),
                                }
                              )}
                            >
                              {fallacy.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end mt-3"></CardFooter>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="counters">Assam</TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
