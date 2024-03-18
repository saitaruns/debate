import AuthContextProvider from "@/components/AuthContext";
import "../globals.css";
import Nav from "@/components/Nav";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Debate",
  description: "debate",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/auth/login");
  }

  return (
    <>
      <AuthContextProvider value={session.user}>
        <Nav />
        {children}
      </AuthContextProvider>
    </>
  );
}
