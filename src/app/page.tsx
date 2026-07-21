import { auth } from "todo/server/auth";
import { HydrateClient } from "todo/trpc/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "todo/components/ui/card";
import { Button, buttonVariants } from "todo/components/ui/button";
import { signOut } from "todo/server/auth";

import Link from "next/link";
import { TodoList } from "todo/components/todo-list";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <div className="bg-background relative flex min-h-screen flex-col overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="bg-size-16_16] absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)]" />
          <div className="from-primary/5 absolute top-0 left-1/2 h-125 w-200 -translate-x-1/2 rounded-full bg-linear-to-b to-transparent blur-3xl" />
        </div>

        {/* Header */}
        <header className="border-border/50 relative border-b backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-foreground size-2 rounded-full" />
              <span className="text-foreground font-mono text-sm font-medium tracking-widest">
                TODO LIST
              </span>
            </div>

            <div className="flex items-center gap-4">
              {session?.user && (
                <span className="text-muted-foreground text-sm">
                  {session.user.username}
                </span>
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                {session?.user && (
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    aria-label="Sign out of your account"
                  >
                    Sign out
                  </Button>
                )}
              </form>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center px-4 py-12">
          <div className="w-full max-w-2xl space-y-6">
            {/* Welcome Card */}
            <Card className="border-border/50 bg-card/80 animate-in fade-in slide-in-from-bottom-4 shadow-2xl backdrop-blur-sm duration-500">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  {session?.user
                    ? `Welcome back, ${session.user.username}`
                    : "Welcome to Todo List"}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {session?.user
                    ? "Manage your tasks and stay productive"
                    : "Please sign in to manage your tasks"}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Todo List Card */}
            {session?.user && (
              <Card className="border-border/50 bg-card/80 animate-in fade-in slide-in-from-bottom-4 shadow-2xl backdrop-blur-sm delay-100 duration-500">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                      Your Tasks
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent>
                  <TodoList />
                </CardContent>
              </Card>
            )}

            {/* Not logged in state */}
            {!session?.user && (
              <Card className="border-border/50 bg-card/80 animate-in fade-in slide-in-from-bottom-4 shadow-2xl backdrop-blur-sm delay-100 duration-500">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground text-sm">
                    Sign in to view and manage your tasks
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <Link
                      href="/login"
                      className={buttonVariants({
                        variant: "outline",
                        size: "default",
                      })}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      className={buttonVariants({
                        variant: "default",
                        size: "default",
                      })}
                    >
                      Create account
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        {/* Footer decorative element */}
        <div className="text-muted-foreground absolute right-8 bottom-8 hidden font-mono text-xs tracking-widest lg:block">
          <span className="opacity-50">003</span>
          <span className="text-muted-foreground/30 mx-2">/</span>
          <span>DASHBOARD</span>
        </div>

        {/* Bottom decorative line */}
        <div className="via-border absolute right-0 bottom-0 left-0 h-px bg-linear-to-r from-transparent to-transparent" />
      </div>
    </HydrateClient>
  );
}
