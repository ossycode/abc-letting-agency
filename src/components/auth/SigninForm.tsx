"use client";

import React, { useState } from "react";
import Label from "../ui/Label";
import Input from "../ui/InputField";
import { EyeClosed, EyeIcon } from "lucide-react";
import Checkbox from "../ui/Checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "@/hooks/useMe";
import Button from "../ui/Button";

const SigninForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [email, setEmail] = useState("ossylab01@lettingagency.com");
  const [password, setPassword] = useState("uw8876!@!@(#(#0");
  const [errMsg, setErrMsg] = useState<string>("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/dashboard";

  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsg("");

    const emailTrim = email.trim();
    if (!emailTrim || !password) {
      setErrMsg("Email and password are required.");
      return;
    }

    try {
      await login.mutateAsync({
        email: emailTrim,
        password,
      });
      router.replace(returnTo);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setErrMsg(e?.message ?? "Unable to sign in. Please try again.");
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-3 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Enter your email and password to sign in to access the admin area
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    type="email"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e: any) => setEmail(e.target.value)}
                    defaultValue={email}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onChange={(e: any) => setPassword(e.target.value)}
                      defaultValue={password}
                    />

                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon
                          className="fill-gray-500 dark:fill-gray-400 "
                          width={15}
                          height={15}
                        />
                      ) : (
                        <EyeClosed
                          className="fill-gray-500 dark:fill-gray-400"
                          width={15}
                          height={15}
                        />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-300">
                      Keep me logged in
                    </span>
                  </div>
                </div>
                {errMsg && <p className="text-sm text-red-500">{errMsg}</p>}
                <div>
                  <Button
                    className="w-full"
                    disabled={login.isPending}
                    size="sm"
                    type="submit"
                  >
                    {login.isPending ? "Signing in…" : "Sign in"}{" "}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
