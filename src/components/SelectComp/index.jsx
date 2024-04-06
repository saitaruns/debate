"use client";

import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { SELECT_KEYS } from "@/constants";
import {
  ArrowDownNarrowWide,
  ArrowUp10,
  ArrowUpNarrowWide,
  Layers,
} from "lucide-react";

const SelectComp = () => {
  const SELECT_VALUES = [
    {
      value: SELECT_KEYS.most_arguments,
      icon: <Layers size={16} strokeWidth={1} />,
      label: "Most Arguments",
    },
    {
      value: SELECT_KEYS.highest_score,
      icon: <ArrowUp10 size={16} strokeWidth={1} />,
      label: "Highest Score",
    },
    {
      value: SELECT_KEYS.newest,
      icon: <ArrowUpNarrowWide size={16} strokeWidth={1} />,
      label: "Newest",
    },
    {
      value: SELECT_KEYS.oldest,
      icon: <ArrowDownNarrowWide size={16} strokeWidth={1} />,
      label: "Oldest",
    },
  ];

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const filter = searchParams.get("filter");

  return (
    <Select
      onValueChange={(val) => {
        params.set("filter", val);
        replace(`${location.origin}?${params.toString()}`);
      }}
      value={filter || "newest"}
    >
      <SelectTrigger className="w-min">
        <SelectValue placeholder="filter by" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort by</SelectLabel>
          {SELECT_VALUES.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="cursor-pointer"
            >
              <div className="flex w-[140px] items-center justify-between gap-2">
                <span>{item.label}</span>
                <span>{item.icon}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectComp;
