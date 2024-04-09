import ArgumentCard from "@/components/ArgumentCard";
import { LandingScrollComp } from "@/components/LandingScrollComp";
import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function LandingPage() {
  const args = [
    {
      id: 1,
      argument: "The earth is flat",
      evidence: [
        { source: "https://www.google.com" },
        { source: "https://www.google.com" },
      ],
      fallacies: [
        { name: "Ad Hominem", count: 2 },
        { name: "False Dilemma", count: 2 },
      ],
      votes: 10,
      user_id: 1,
      user_data: {
        name: "John Doe",
        avatar_url: "https://randomuser.me/api/portraits",
      },
      created_at: new Date(),
    },
    {
      id: 2,
      argument: "Yes the earth is flat.",
      support_to: 1,
      evidence: [{ source: "https://www.google.com" }],
      fallacies: [{ name: "Appeal to Authority", count: 3 }],
      votes: 5,
      user_id: 1,
      user_data: {
        name: "John Doe",
        avatar_url: "https://randomuser.me/api/portraits",
      },
      created_at: new Date(),
    },
    {
      id: 3,
      argument: "The earth is round",
      counter_to: 2,
      evidence: [{ source: "https://www.google.com" }],
      // fallacies: [
      //   { name: "Circular Reasoning", count: 1 },
      // ],
      votes: 15,
      user_id: 2,
      user_data: {
        name: "Jane Doe",
        avatar_url: "https://randomuser.me/api/portraits",
      },
      created_at: new Date(),
    },
  ];

  return (
    <>
      <section
        className={cn(
          "px-10 sm:px-10 lg:px-30",
          "dark:bg-grid-white/[0.1] bg-grid-black/[0.1]",
          "relative h-screen"
        )}
      >
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_top,transparent_20%,black)]" />
        <nav className="z-50 flex items-center justify-between px-10 sm:container py-6">
          <h1>Debate</h1>
          <div className="flex items-center space-x-4">
            <Link href={"/auth/login"}>Login</Link>
            <Link href={"/auth/signup"}>Register</Link>
          </div>
        </nav>
        <div className="flex sm:items-center flex-col sm:flex-row relative">
          <div className="flex-1 flex lg:ml-40 flex-col space-y-4">
            <TextGenerateEffect
              className="text-2xl sm:text-4xl font-bold mt-12 sm:mt-0"
              words={"Welcome to Debate"}
            />
            <TextGenerateEffect
              words="Engage in healthy and respectful debates with people from all over
            the world. Challenge your beliefs, learn new perspectives, and
            sharpen your critical thinking skills."
              className="text-md sm:text-lg"
            />

            <Link href={"/auth/login"} passHref>
              <Button>Get Started</Button>
            </Link>
          </div>
          <div className="mt-12 sm:mt-0 flex-1 sm:w-7/12 flex flex-col sm:p-5 sm:scale-[0.8]">
            <h1>Why the earth is flat</h1>
            {args.map((arg) => (
              <ArgumentCard
                key={arg.id}
                {...arg}
                className={cn(
                  {
                    "slide-in-from-bottom-1/3 fade-in-0": arg.id === 1,
                    "slide-in-from-bottom-1/4 fade-in-0 hidden sm:block":
                      arg.id === 2,
                    "slide-in-from-bottom-1/2 fade-in-0 hidden sm:block self-end":
                      arg.id === 3,
                  },
                  "animate-in delay-300 duration-500",
                  "w-full sm:w-11/12"
                )}
              />
            ))}
          </div>
        </div>
      </section>
      <LandingScrollComp />
      <section className="md:px-40 px-10 py-20 h-screen flex justify-center items-center">
        <div className="flex flex-col sm:flex-row gap-7 mt-10">
          {[
            {
              title: "Debate",
              image_url: "/public_discussion.svg",
              description:
                "Engage in healthy and respectful debates with people from all over the world. Challenge your beliefs, learn new perspectives, and sharpen your critical thinking skills.",
            },
            {
              title: "Learn",
              image_url: "/knowledge.svg",
              description:
                "Access a wealth of information on a wide range of topics. Learn about different perspectives, arguments, and fallacies.",
            },
            {
              title: "Grow",
              image_url: "/stepping_up.svg",
              description:
                "Grow your knowledge, expand your horizons, and become a more informed and critical thinker.",
            },
          ].map((item, index) => (
            <div key={index} className="flex-1">
              <div className="w-7/12 md:w-8/12 m-auto h-[200px] relative mb-7">
                <Image
                  src={item.image_url}
                  alt="svg"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <h1 className="text-2xl font-bold mb-3">{item.title}</h1>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
