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
import { formatDistance, subDays } from "date-fns";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let { data: args, error } = await supabase
    .from("Argument")
    .select("*, users(*)")
    .neq("title", null)
    .order("created_at", { ascending: false });

  return (
    <div className="flex m-3">
      <div className="w-2/12" />
      <div className="w-full sm:w-8/12 md:w-6/12 flex-col mt-3 mr-3 space-y-2">
        {args?.map((arg) => (
          <Link key={arg.id} className="flex w-full" href={`/arg/${arg.id}`}>
            <Card className="w-full">
              <CardHeader className="p-3">
                <CardTitle className="text-md font-medium truncate">
                  {arg?.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {arg?.up_votes} up votes | {arg?.down_votes} down votes |{" "}
                  {arg?.arguments} arguments
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
                    members active
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-[8px]">OM</AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-medium leading-none">
                    {arg?.users?.data?.name}{" "}
                    <span className="font-normal">
                      {formatDistance(arg.created_at, new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
