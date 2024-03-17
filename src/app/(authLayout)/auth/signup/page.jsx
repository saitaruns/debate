import { SignupForm } from "@/components/Forms/AuthForms/signup";
import { Separator } from "@/components/ui/separator";

const SignUpPage = () => {
  return (
    <>
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <Separator />
      <SignupForm />
    </>
  );
};

export default SignUpPage;
