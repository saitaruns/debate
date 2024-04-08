"use client";

import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import ArgumentCard from "../ArgumentCard";
import { cn } from "@/lib/utils";

const content = [
  {
    title: "Put your argument out",
    description:
      "Share your thoughts and ideas with the world. Our platform makes it easy to express yourself and engage in meaningful conversations with others. Whether you're a student, a professional, or just someone who loves to debate, we've got you covered. So go ahead, put your argument out there and let your voice be heard.",
    content: (
      <div className="flex flex-col justify-center w-full h-full [&>*]:ml-5">
        <div className="text-md p-2 w-fit">Earth is flat</div>
        <ArgumentCard
          {...{
            id: 1,
            argument:
              "The earth is flat. There is no scientific evidence to support the claim that the earth is round. The idea of a spherical earth is a myth perpetuated by the scientific community to control the masses. The truth is that the earth is flat, and we should embrace this fact.",
            evidence: [{ source: "https://www.google.com" }],
            fallacies: [{ name: "Hasty Generalization", count: 1 }],
            votes: 10,
            user_id: 1,
            user_data: {
              name: "John Doe",
              avatar_url: "https://randomuser.me/api/portraits",
            },
            created_at: new Date(),
          }}
          className={"animate-in slide-in-from-bottom-9 fade-in-0 duration-500"}
        />
      </div>
    ),
  },
  {
    title: "Support your argument",
    description:
      "Back up your argument with solid evidence and logical reasoning. Our platform allows you to provide evidence for your claims, cite sources, and explain your reasoning in a clear and concise manner. Whether you're making a case for your beliefs or challenging someone else's ideas, you can rely on our platform to help you make a strong argument.",
    content: (
      <div className="flex items-center w-full h-full [&>*]:ml-5">
        <ArgumentCard
          {...{
            id: 2,
            argument:
              "Yeah, One of the reasons is that the  horizon always appears perfectly flat 360 degrees around the observer. All amateur balloon, rocket, plane and drone footage show a completely flat horizon over 20+ miles high. Only NASA and other government space agencies show curvature in their fake CGI photos/videos.",
            support_to: 1,
            evidence: [{ source: "https://www.google.com" }],
            fallacies: [
              { name: "Appeal to Authority", count: 3 },
              { name: "Circular Reasoning", count: 1 },
            ],
            votes: 14,
            user_id: 1,
            user_data: {
              name: "Jane Smith",
              avatar_url: "https://randomuser.me/api/portraits",
            },
            created_at: new Date(),
          }}
          className={"animate-in slide-in-from-bottom-9 fade-in-0 duration-500"}
        />
      </div>
    ),
  },
  {
    title: "Challenge opposing views",
    description:
      "Engage with others who hold different opinions and challenge their views. Our platform allows you to counter arguments, point out fallacies, and present alternative perspectives. Whether you're looking to test your own beliefs or sharpen your critical thinking skills, you can count on our platform to help you engage in healthy and respectful debates.",
    content: (
      <div className="flex items-center justify-end w-full h-full [&>*]:mr-5">
        <ArgumentCard
          {...{
            id: 3,
            argument:
              "The earth is round. There is overwhelming scientific evidence to support the claim that the earth is round. The idea of a flat earth has been debunked time and time again by experts in the field. It's time to put this myth to rest and embrace the truth that the earth is round.",
            counter_to: 1,
            evidence: [{ source: "https://www.google.com" }],
            votes: 47,
            user_id: 1,
            user_data: {
              name: "Sarah Johnson",
              avatar_url: "https://randomuser.me/api/portraits",
            },
            created_at: new Date(),
          }}
          className={"animate-in slide-in-from-bottom-9 fade-in-0 duration-500"}
        />
      </div>
    ),
  },
];
export function LandingScrollComp({ className }) {
  return (
    <section className={cn("py-10 bg-foreground dark:bg-secondary", className)}>
      <h1 className="text-4xl font-bold text-center text-slate-100  mt-10 mb-20">
        How it works
      </h1>
      <StickyScroll content={content} />
    </section>
  );
}
