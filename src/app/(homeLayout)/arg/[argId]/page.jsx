import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import CounterCardList from "@/components/CounterCardList";

export default async function Argument({ params: { argId } }) {
  const supabase = createClient(cookies());

  let { data: args, error } = await supabase.rpc("get_argument_rows", {
    a_id: argId,
    n: 2,
  });

  return (
    <>
      <div className="text-xl font-normal my-5 flex">
        <h1 className="flex-1">{args[0].title}</h1>
      </div>
      <CounterCardList argus={args} />
    </>
  );
}
