import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import CounterCardList from "@/components/CounterCardList";

export default async function Argument({ params: { argId } }) {
  const supabase = createClient(cookies());

  let { data: args, error } = await supabase
    .rpc("get_argument_rows", {
      arg_id: argId,
      n: 2,
    })
    .order("level", { ascending: true })
    .order("created_at", { ascending: true });

  console.log(args, error);

  let { data: fallacies, error: fallaciesError } = await supabase
    .from("ArgFallacyMap")
    .select("*, Fallacies(*)")
    .in(
      "arg_id",
      args?.map((arg) => arg.id)
    );

  args =
    args?.map((arg) => {
      const newFallacies = fallacies
        ?.map((fallacy) => {
          if (fallacy.arg_id === arg.id) {
            return fallacy.Fallacies;
          }
        })
        .filter((fallacy) => fallacy);
      arg.fallacies = newFallacies;
      return arg;
    }) || [];

  const argus = [...args];

  return (
    <>
      <div className="text-xl font-normal my-5 flex">
        <h1 className="flex-1">{argus[0].title}</h1>
      </div>
      <CounterCardList argus={argus} />
    </>
  );
}
