import { auth } from "todo/server/auth";
import { redirect } from "next/navigation";
import { HydrateClient } from "todo/trpc/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "todo/components/ui/card";
import { Button } from "todo/components/ui/button";
import { signOut } from "todo/server/auth";
import Link from "next/link";
import { CategoryManager } from "todo/components/category-manager";

export default async function CategoriesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

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
              <span className="text-muted-foreground text-sm">
                {session.user.username}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  aria-label="Sign out of your account"
                >
                  Sign out
                </Button>
              </form>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center px-4 py-12">
          <div className="w-full max-w-2xl space-y-6">
            {/* Back link */}
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
            >
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to Tasks
            </Link>

            {/* Categories Card */}
            <Card className="border-border/50 bg-card/80 animate-in fade-in slide-in-from-bottom-4 shadow-2xl backdrop-blur-sm duration-500">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  Categories
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Create and manage categories to organize your tasks
                </CardDescription>
              </CardHeader>

              <CardContent>
                <CategoryManager />
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer decorative element */}
        <div className="text-muted-foreground absolute right-8 bottom-8 hidden font-mono text-xs tracking-widest lg:block">
          <span className="opacity-50">004</span>
          <span className="text-muted-foreground/30 mx-2">/</span>
          <span>CATEGORIES</span>
        </div>

        {/* Bottom decorative line */}
        <div className="via-border absolute right-0 bottom-0 left-0 h-px bg-linear-to-r from-transparent to-transparent" />
      </div>
    </HydrateClient>
  );
}
