import SigninForm from "@/components/auth/SigninForm";
import GridShape from "@/components/ui/GridShape";
import { Logo } from "@/components/ui/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " SignIn Page ",
};

export default function SignInPage() {
  return (
    <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  sm:p-0">
      <SigninForm />
      <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
        <div className="relative items-center justify-center  flex z-1">
          <GridShape />
          <div className="flex flex-col items-center max-w-xs">
            <Logo />
          </div>
        </div>
      </div>
    </div>
  );
}
