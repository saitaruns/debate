import clsx from "clsx";
import ListCard from "@/components/ListCard";
import CounterCard from "@/components/CounterCard";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function Argument({ params: { argId } }) {
  const supabase = createClient(cookies());

  let { data: args, error } = await supabase
    .rpc("get_argument_rows", {
      arg_id: argId,
      n: 2,
    })
    .select("*, users(*)")
    .order("level", { ascending: true })
    .order("created_at", { ascending: true });

  let { data: fallacies, error: fallaciesError } = await supabase
    .from("ArgFallacyMap")
    .select("*, Fallacies(*)")
    .in(
      "arg_id",
      args.map((arg) => arg.id)
    );

  args =
    args?.map((arg) => {
      const newFallacies = fallacies?.map((fallacy) => {
        if (fallacy.arg_id === arg.id) {
          return fallacy.Fallacies;
        }
      });
      arg.fallacies = newFallacies;
      return arg;
    }) || [];

  const argus = [...args];

  const GetCard = ({ index }) => {
    const tempArgs = [];

    const argLevel = argus[index].level;

    for (let i = index; i < argus.length; i += 1) {
      const arg = argus[i];
      if (arg.level !== argLevel) {
        break;
      }
      tempArgs.push(arg);
    }

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
          showMore={Math.random() < 0.5}
        >
          {tempArgs.map((arg) => (
            <CounterCard key={arg.id} arg={arg} />
          ))}
        </ListCard>
      </div>
    );
  };

  const nums = argus.reduce((acc, arg, i) => {
    if (i === 0 || arg.level !== argus[i - 1].level) {
      acc.push(i);
    }
    return acc;
  }, []);

  return (
    <>
      <div className="text-xl font-normal my-5 flex">
        <h1 className="flex-1">{argus[0].title}</h1>
      </div>
      <div className="space-y-3">
        {nums.map((num, i) => (
          <GetCard key={i} index={num} />
        ))}
      </div>
    </>
  );
}
