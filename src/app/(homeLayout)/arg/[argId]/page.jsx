import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import CounterCardList from "@/components/CounterCardList";

export default async function Argument({
  params: { argId },
  searchParams: { arg },
}) {
  const supabase = createClient(cookies());

  let { data: args, error } = await supabase.rpc("get_argument_rows", {
    a_id: argId,
    m_arg_id: arg || null,
    n: 2,
  });

  if (error) {
    console.error("Error fetching argument:", error);
  }

  return <CounterCardList argus={args} />;
}
