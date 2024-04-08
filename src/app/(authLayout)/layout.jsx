import DarkModeToggle from "@/components/DarkModeToggle";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Auth | Debate",
  description: "auth page",
};

export default async function AuthLayout({ children }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  if (data?.user && !error) {
    redirect("/home");
  }

  return (
    <div>
      {/* <h2 className="text-2xl absolute font-bold text-center w-full top-3">
        Debate
      </h2> */}
      <DarkModeToggle className="absolute right-3 top-3" />
      <div className="flex items-center justify-center h-svh px-6 py-12 lg:px-8">
        <div className="mx-auto w-full md:w-6/12 lg:w-1/3 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}
