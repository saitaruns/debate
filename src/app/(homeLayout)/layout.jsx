import "../globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Debate",
  description: "debate",
};

export default function RootLayout({ children }) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
