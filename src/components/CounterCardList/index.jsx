"use client";

import React, { useEffect, useState } from "react";
import ListCard from "../ListCard";
import CounterCard from "../CounterCard";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const PAGE_SIZE = 2;

const supabase = createClient();

const CounterCardList = ({ argus: args }) => {
  const [argus, setArgus] = useState(args);

  const addToArgus = ({ arg, fallacies }) => {
    const sortedArgs = [...argus, arg]
      .map((a) => {
        if (a.id === arg.counter_to) {
          return {
            ...a,
            fallacies: [
              ...(a?.fallacies || []),
              ...fallacies?.map((fallacy) => fallacy.Fallacies),
            ],
          };
        }
        return a;
      })
      .sort((a, b) => a.level - b.level);

    setArgus(sortedArgs);
  };

  const getMoreArgs = async ({ argLevel, page, setCount, setLoading }) => {
    setLoading(true);
    const {
      data: newArgs,
      count,
      error,
    } = await supabase
      .from("Argument")
      .select("*, users(*)", { count: "exact" })
      .eq("related_to", args[0].id)
      .eq("level", argLevel)
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
      .order("created_at", { ascending: true });

    console.log(newArgs, error, argLevel, page);
    if (error) {
      console.error("Error fetching arguments", error);
      setLoading(false);
    } else {
      setArgus((prevArgs) => {
        const newArgus = [...prevArgs, ...newArgs].sort(
          (a, b) => a.level - b.level
        );
        return newArgus;
      });
      setCount(count);
      setLoading(false);
    }
  };

  const nums = argus.reduce((acc, arg, i) => {
    if (i === 0 || arg.level !== argus[i - 1].level) {
      acc.push(i);
    }
    return acc;
  }, []);

  return (
    <div className="space-y-3">
      {nums.map((num) => (
        <GetCard
          key={num}
          index={num}
          argus={argus}
          addToArgus={addToArgus}
          getMoreArgs={getMoreArgs}
        />
      ))}
    </div>
  );
};

const GetCard = ({ index, argus, addToArgus, getMoreArgs }) => {
  const [tempArgs, setTempArgs] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const argLevel = argus[index].level;

  useEffect(() => {
    const tArgs = [];
    for (let i = index; i < argus.length; i += 1) {
      const arg = argus[i];
      if (arg.level !== argLevel) {
        break;
      }
      tArgs.push(arg);
    }
    setTempArgs(tArgs);
  }, [index, argLevel, argus]);

  const key = tempArgs.reduce((acc, arg) => acc + String(arg.id) + "-", "");

  return (
    <div
      key={key}
      className={clsx(
        "flex",
        "flex-col",
        argLevel % 2 === 0 ? "items-start" : "items-end"
      )}
    >
      <ListCard
        className="w-11/12 sm:w-10/12 md:w-8/12 overflow-auto"
        maxHeight="600px"
        showMore
      >
        {tempArgs.map((arg) => (
          <CounterCard key={arg.id} arg={arg} addToArgus={addToArgus} />
        ))}
        {count === 0 || page * PAGE_SIZE < count ? (
          <Button
            variant="ghost"
            className="w-fit mx-auto mt-1"
            onClick={() => {
              getMoreArgs({ argLevel, page, setCount, setLoading });
              setPage((prevPage) => prevPage + 1);
            }}
          >
            <span className="flex items-center">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Show More{" "}
              {count !== 0
                ? page + 1 + "/" + Math.ceil(count / PAGE_SIZE)
                : null}
            </span>
          </Button>
        ) : null}
      </ListCard>
    </div>
  );
};

export default CounterCardList;
