"use client";

import { api } from "todo/trpc/react";
import { cn } from "todo/lib/utils";

interface CategorySelectProps {
  value: string | null;
  onChange: (categoryId: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export function CategorySelect({
  value,
  onChange,
  disabled,
  className,
}: CategorySelectProps) {
  const { data: categories, isLoading } = api.category.getAll.useQuery();

  const selectedCategory = categories?.find((c) => c.id === value);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "border-border/50 size-3 shrink-0 rounded-full border",
          !selectedCategory && "bg-muted",
        )}
        style={{
          backgroundColor: selectedCategory?.color ?? undefined,
        }}
        aria-hidden="true"
      />

      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={disabled ?? isLoading}
        className={cn(
          "bg-input/50 h-9 w-full min-w-0 appearance-none rounded-3xl border border-transparent px-3 py-1 pr-8 text-sm transition-[color,box-shadow,background-color] outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-3",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_10px_center] bg-no-repeat",
        )}
        aria-label="Select category"
      >
        <option value="">No category</option>
        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
