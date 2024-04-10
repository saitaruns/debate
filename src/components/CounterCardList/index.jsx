"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import ListCard from "../ListCard";
import CounterCard from "../CounterCard";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { Loader, Plus } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const PAGE_SIZE = 2;

const supabase = createClient();

const CounterCardList = ({ argus: args }) => {
  const [argus, setArgus] = useState(() =>
    args.sort((a, b) => a.level - b.level)
  );
  const searchParams = useSearchParams();
  const [renderedArgs, setRenderedArgs] = useState([]);

  const addToArgus = useCallback(({ arg, fallacies }) => {
    setArgus((prev) => {
      return [...prev, arg]
        .map((a) => {
          if (a.id === arg.counter_to) {
            return {
              ...a,
              fallacies: [
                ...(a?.fallacies || []),
                ...(fallacies?.map((fallacy) => fallacy.Fallacies) || []),
              ].reduce((acc, fallacy) => {
                if (acc.find((f) => f.id === fallacy.id)) {
                  return acc;
                }
                return [...acc, fallacy];
              }, []),
            };
          }
          return a;
        })
        .reduce((acc, a) => {
          const index = acc.findIndex((arg) => arg.id === a.id);
          if (index !== -1) {
            acc[index] = {
              ...acc[index],
              argument: a.argument,
              title: a.title,
              evidence: a.evidence,
            };
            return acc;
          }
          return [...acc, a];
        }, [])
        .sort((a, b) => a.level - b.level);
    });
  }, []);

  const getMoreArgs = useCallback(
    async ({ argLevel, page, setLoading }) => {
      setLoading(true);
      const { data: newArgs, error } = await supabase
        .rpc("get_argument_rows", {
          a_id: args[0].id,
          n: null,
        })
        .eq("level", argLevel)
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching arguments", error);
        toast.error("Error fetching arguments");
        setLoading(false);
      } else {
        setArgus((prevArgs) => {
          const newArgus = [...prevArgs, ...newArgs]
            .reduce((acc, arg) => {
              if (acc.find((a) => a.id === arg.id)) {
                return acc;
              }
              return [...acc, arg];
            }, [])
            .sort((a, b) => a.level - b.level);
          return newArgus;
        });
        setLoading(false);
      }
    },
    [args]
  );

  useEffect(() => {
    const res = Object.entries(
      argus.reduce((acc, arg) => {
        if (acc[arg.level]) {
          acc[arg.level].push(arg);
        } else {
          acc[arg.level] = [arg];
        }
        return acc;
      }, {})
    ).map(([level, args]) => args);
    setRenderedArgs(res);
  }, [argus]);

  useEffect(() => {
    const handler = () => {
      setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        const argId = params.get("arg");
        const el = document.getElementById(`#arg_${argId}`);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
          el.animate(
            [
              { backgroundColor: "hsl(var(--primary) / 0.1)" },
              { backgroundColor: "initial" },
            ],
            { duration: 2000, iterations: 1 }
          );
        }
      }, 100);
    };

    handler();
  }, [searchParams]);

  return (
    <>
      <h1 className="text-xl font-normal mt-8 mb-5 break-all ">
        {argus?.[0]?.title}
      </h1>
      {renderedArgs.map((args) => {
        return (
          <GetCard
            key={args[0].level}
            argus={args}
            addToArgus={addToArgus}
            getMoreArgs={getMoreArgs}
          />
        );
      })}
    </>
  );
};

const GetCard = memo(
  ({ argus, addToArgus, getMoreArgs }) => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const argLevel = argus[0].level;
    const levelCount = argus[0].level_count;

    return (
      <div
        className={clsx(
          "flex flex-col",
          argLevel % 2 === 0 ? "items-start" : "items-end"
        )}
      >
        <p className="text-xs mb-1 text-slate-500">
          {argus.length}/{levelCount} arguments
        </p>
        <ListCard
          autoScroll
          className="w-11/12 sm:w-10/12 md:w-8/12 overflow-auto"
          maxHeight="600px"
        >
          {argus.map((arg) => (
            <CounterCard key={arg.id} arg={arg} addToArgus={addToArgus} />
          ))}
          {argus.length < levelCount ? (
            <Button
              variant="ghost"
              className="w-fit mx-auto mt-1"
              onClick={() => {
                getMoreArgs({ argLevel, page, setLoading });
                setPage((prevPage) => prevPage + 1);
              }}
            >
              <span className="flex items-center gap-1">
                <span>Show more</span>
                {loading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
              </span>
            </Button>
          ) : null}
        </ListCard>
      </div>
    );
  },
  (prevProps, nextProps) =>
    JSON.stringify(prevProps) === JSON.stringify(nextProps)
);

GetCard.displayName = "GetCard";

export default CounterCardList;
