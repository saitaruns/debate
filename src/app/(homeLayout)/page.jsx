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

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let {
    data: args,
    count,
    error,
  } = await supabase
    .from("Argument")
    .select("*, users(*)", {
      count: "exact",
    })
    .neq("title", null)
    .range(0, 5)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching arguments", error);
  }

  console.log(args, count, error);

  return (
    <div className="flex m-3">
      <div className="w-0 sm:w-2/12" />
      <div className="w-full sm:w-8/12 md:w-6/12 flex-col mt-3 mr-3 space-y-2">
        <p className="m-0 text-xs">{count} arguments</p>
        {args?.map((arg) => (
          <Card key={arg.id} className="w-full">
            <CardHeader className="p-3">
              <Link href={`/arg/${arg.id}`} className="hover:underline">
                <CardTitle className="text-md font-medium truncate">
                  {arg?.title}
                </CardTitle>
              </Link>
              <CardDescription className="text-xs">
                {arg?.up_votes} up votes | {arg?.down_votes} down votes |{" "}
                {arg?.count} arguments
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
              <div className="flex items-center space-x-1">
                <Avatar className="w-4 h-4">
                  <AvatarImage src={arg?.users?.data?.avatar_url} />
                  <AvatarFallback className="text-[6px]">OM</AvatarFallback>
                </Avatar>
                <p className="text-xs font-medium leading-none">
                  {arg?.users?.data?.name}{" "}
                  <span className="font-normal hidden sm:inline">
                    {formatDistanceToNow(arg.created_at, {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="font-normal sm:hidden">
                    {formatDistanceToNowStrict(arg.created_at, {})}
                  </span>
                </p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
