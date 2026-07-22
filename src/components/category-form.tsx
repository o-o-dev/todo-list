"use client";

import { useState } from "react";
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

  // TODO: Get utils from api.useUtils()
  // TODO: Create mutation using api.category.create.useMutation()
  // - onSuccess: reset form, invalidate category.getAll, call onSuccess prop
  const isPending = false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // TODO: Call mutation with { name: trimmedName, color }
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
          disabled={isPending}
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
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending || !name.trim()}
        className="w-full"
      >
        {isPending ? "Creating..." : "Create Category"}
      </Button>
    </form>
  );
}
