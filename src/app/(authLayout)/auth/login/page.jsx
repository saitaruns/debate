import React from "react";

import { LoginForm } from "@/components/Forms/AuthForms/login";
import { Separator } from "@/components/ui/separator";

function LoginPage() {
  return (
    <>
      <h2 className="text-2xl font-bold">Login</h2>
      <Separator />
      <LoginForm />
    </>
  );
}

export default LoginPage;
