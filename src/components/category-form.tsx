"use client";

import { useState } from "react";
import { api } from "todo/trpc/react";
import { Input } from "todo/components/ui/input";
import { Button } from "todo/components/ui/button";
import { ColorPicker } from "todo/components/color-picker";
import { DEFAULT_CATEGORY_COLOR, type CategoryColor } from "todo/lib/colors";

interface CategoryFormProps {
  onSuccess?: () => void;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<CategoryColor>(DEFAULT_CATEGORY_COLOR);

  const utils = api.useUtils();

  const createCategory = api.category.create.useMutation({
    onSuccess: () => {
      setName("");
      setColor(DEFAULT_CATEGORY_COLOR);
      void utils.category.getAll.invalidate();
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    createCategory.mutate({ name: trimmedName, color });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="category-name"
          className="text-sm font-medium text-foreground"
        >
          Category Name
        </label>
        <Input
          id="category-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Work, Personal, Shopping"
          maxLength={50}
          disabled={createCategory.isPending}
          aria-describedby="category-name-hint"
        />
        <p id="category-name-hint" className="text-xs text-muted-foreground">
          Give your category a short, descriptive name
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Color</label>
        <ColorPicker
          value={color}
          onChange={setColor}
          disabled={createCategory.isPending}
        />
      </div>

      <Button
        type="submit"
        disabled={createCategory.isPending || !name.trim()}
        className="w-full"
      >
        {createCategory.isPending ? "Creating..." : "Create Category"}
      </Button>
    </form>
  );
}
