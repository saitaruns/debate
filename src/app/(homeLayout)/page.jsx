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

const getData = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 1);
  });

export default async function Home() {
  const args = [
    {
      id: 1,
      title: "Earth is flat",
      description: "The Earth is flat because it looks flat",
      time: "2021-08-01T00:00:00Z",
      user: {
        id: 1,
        username: "user1",
      },
      votes: 10,
      arguments: 72,
      people: 24,
    },
    {
      id: 2,
      title: "Earth is round",
      description: "The Earth is round because it looks round",
      time: "2021-08-01T00:00:00Z",
      user: {
        id: 2,
        username: "user2",
      },
      votes: 10,
      arguments: 72,
      people: 12,
    },
    {
      id: 3,
      title: "Earth is a cube",
      description: "The Earth is a cube because it looks like a cube",
      time: "2021-08-01T00:00:00Z",
      user: {
        id: 3,
        username: "user3",
      },
      votes: 10,
      arguments: 72,
      people: 24,
    },
    {
      id: 4,
      title: "Earth is a sphere",
      description: "The Earth is a sphere because it looks like a sphere",
      time: "2021-08-01T00:00:00Z",
      user: {
        id: 4,
        username: "user4",
      },
      votes: 10,
      arguments: 72,
      people: 24,
    },
    {
      id: 5,
      title: "Earth is a pyramid",
      description: "The Earth is a pyramid because it looks like a pyramid",
      time: "2021-08-01T00:00:00Z",
      user: {
        id: 5,
        username: "user5",
      },
      votes: 10,
      arguments: 72,
      people: 24,
    },
    {
      id: 6,
      title: "Earth is a cylinder",
      description: "The Earth is a cylinder because it looks like a cylinder",
      time: "2021-08-01T00:00:00Z",
      user: {
        id: 6,
        username: "user6",
      },
      votes: 10,
      arguments: 72,
      people: 24,
    },
    {
      id: 7,
      title: "Earth is a cone",
      description: "The Earth is a cone because it looks like a cone",
      time: "2021-08-01T00:00:00Z",
      user: {
        id: 7,
        username: "user7",
      },
      votes: 10,
      arguments: 72,
      people: 24,
    },
    {
      id: 8,
      title: "Earth is a torus",
      description: "The Earth is a torus because it looks like a torus",
      time: "2021-08-01T00:00:00Z",
      user: {
        id: 8,
        username: "user8",
      },
      votes: 10,
      arguments: 72,
      people: 24,
    },
  ];

  const data = await getData();

  return (
    <div className="flex m-3">
      <div className="w-2/12" />
      <div className="w-full sm:w-8/12 md:w-6/12 flex-col mt-3 mr-3 space-y-2">
        {args.map((arg) => (
          <Link key={arg.id} className="flex w-full" href={`/arg/${arg.id}`}>
            <Card key={arg.id} className="w-full">
              <CardHeader className="p-3">
                <CardTitle className="text-md font-medium truncate">
                  {arg.title} | Cupidatat irure officia nostrud ex minim
                  reprehenderit occaecat do culpa eu nisi reprehenderit.
                </CardTitle>
                <CardDescription className="text-xs">
                  {arg.votes} votes | {arg.arguments} arguments
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="line-clamp-2 text-xs">
                  {arg.description} | Duis non aliquip aute excepteur voluptate.
                  Amet labore fugiat aliquip proident aliqua laborum nisi
                  excepteur sit laborum adipisicing. Officia qui occaecat
                  consequat minim reprehenderit ipsum aliqua minim commodo
                  consequat consectetur.
                </p>
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
                    Sofia Davis{" "}
                    <span className="font-normal">posted 5 days ago</span>
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
