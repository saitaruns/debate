import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import CounterCardList from "@/components/CounterCardList";

export default async function Argument({ params: { argId } }) {
  const supabase = createClient(cookies());

  let { data: args, error } = await supabase.rpc("get_argument_rows", {
    a_id: argId,
    n: 2,
  });

  if (error) {
    console.error("Error fetching argument:", error);
  }

  return (
    <>
      <h1 className="text-xl font-normal mt-8 mb-5 break-all ">
        {args?.[0]?.title}
      </h1>
      <CounterCardList argus={args} />
    </>
  );
}
