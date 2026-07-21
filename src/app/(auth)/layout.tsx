export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-size-16_16] absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)]" />
        <div className="from-primary/5 absolute top-0 left-1/2 h-125 w-200 -translate-x-1/2 rounded-full bg-linear-to-b to-transparent blur-3xl" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 hidden lg:block">
        <div className="flex items-center gap-3">
          <div className="bg-foreground size-2 rounded-full" />
          <span className="text-muted-foreground font-mono text-xs tracking-widest">
            TODO LIST
          </span>
        </div>
      </div>

      {/* Page content (login or signup card) */}
      {children}

      {/* Bottom decorative line */}
      <div className="via-border absolute right-0 bottom-0 left-0 h-px bg-linear-to-r from-transparent to-transparent" />
    </div>
  );
}
