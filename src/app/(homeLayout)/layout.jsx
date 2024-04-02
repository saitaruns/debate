import { cookies } from "next/headers";
import "../globals.css";
import Nav from "@/components/Nav";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AuthContextProvider from "@/components/AuthContext";

export const metadata = {
  title: "Debate",
  description: "debate",
};

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <AuthContextProvider value={data?.user || {}}>
      <div className="min-h-screen">
        <Nav />
        {children}
      </div>
    </AuthContextProvider>
  );
}
