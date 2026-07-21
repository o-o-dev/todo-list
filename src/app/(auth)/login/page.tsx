"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "todo/components/ui/button";
import { Input } from "todo/components/ui/input";
import { Label } from "todo/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "todo/components/ui/card";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Error state
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    form?: string;
  }>({});

  // Validation
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (!result?.error) {
      router.push("/");
    } else {
      const errorMessages: Record<string, string> = {
        CredentialsSignin: "Invalid Username or Password",
      };
      const message = errorMessages[result?.error ?? ""] ?? "Login Failed";
      setErrors({ form: message });
    }
    setIsLoading(false);
  };

  return (
    <Card className="border-border/50 bg-card/80 animate-in fade-in slide-in-from-bottom-4 w-full max-w-md shadow-2xl backdrop-blur-sm duration-500">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Error */}
          {errors.form && (
            <div className="border-destructive/50 bg-destructive/10 text-destructive animate-in fade-in slide-in-from-top-2 rounded-lg border px-4 py-3 text-sm duration-200">
              {errors.form}
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              aria-invalid={!!errors.username}
              className="focus:ring-primary/20 h-11 transition-all duration-200 focus:ring-2"
            />
            {errors.username && (
              <p className="text-destructive animate-in fade-in slide-in-from-top-1 text-sm duration-200">
                {errors.username}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              aria-invalid={!!errors.password}
              className="focus:ring-primary/20 h-11 transition-all duration-200 focus:ring-2"
            />
            {errors.password && (
              <p className="text-destructive animate-in fade-in slide-in-from-top-1 text-sm duration-200">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="mt-6 h-11 w-full text-sm font-medium tracking-wide transition-all duration-200"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="size-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>

          {/* Signup Link */}
          <p className="text-muted-foreground pt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-foreground font-medium underline-offset-4 transition-colors hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
