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
import { api } from "todo/trpc/react";

export default function SignupPage() {
  const router = useRouter();

  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Error state
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});

  const signup = api.signup.signup.useMutation({
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      setErrors({ form: error.message });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  // Validation
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (username.length < 8) {
      newErrors.username = "Username must be at least 8 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Only letters, numbers, and underscores allowed";
    }

    if (password.length < 9) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    await signup.mutateAsync({ username, password });
  };

  return (
    <Card className="border-border/50 bg-card/80 animate-in fade-in slide-in-from-bottom-4 w-full max-w-md shadow-2xl backdrop-blur-sm duration-500">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your details below to get started
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
              placeholder="Create a password"
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

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
              className="focus:ring-primary/20 h-11 transition-all duration-200 focus:ring-2"
            />
            {errors.confirmPassword && (
              <p className="text-destructive animate-in fade-in slide-in-from-top-1 text-sm duration-200">
                {errors.confirmPassword}
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
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </Button>

          {/* Login Link */}
          <p className="text-muted-foreground pt-4 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-foreground font-medium underline-offset-4 transition-colors hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
