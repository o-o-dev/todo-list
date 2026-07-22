"use client";

import { useState } from "react";
import { api } from "todo/trpc/react";
import { Input } from "todo/components/ui/input";
import { Button } from "todo/components/ui/button";
import { ColorPicker } from "todo/components/color-picker";
import { type CategoryColor } from "todo/lib/colors";

interface Category {
  id: string;
  name: string;
  color: string | null;
}

interface CategoryItemProps {
  category: Category;
}

export function CategoryItem({ category }: CategoryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [editColor, setEditColor] = useState<CategoryColor>(
    (category.color as CategoryColor) ?? "#3b82f6"
  );

  const utils = api.useUtils();

  const updateCategory = api.category.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      void utils.category.getAll.invalidate();
    },
  });

  const deleteCategory = api.category.delete.useMutation({
    onSuccess: () => {
      void utils.category.getAll.invalidate();
    },
  });

  const handleSave = () => {
    const trimmedName = editName.trim();
    if (!trimmedName) return;

    updateCategory.mutate({
      id: category.id,
      name: trimmedName,
      color: editColor,
    });
  };

  const handleCancel = () => {
    setEditName(category.name);
    setEditColor((category.color as CategoryColor) ?? "#3b82f6");
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteCategory.mutate({ id: category.id });
  };

  const isPending = updateCategory.isPending || deleteCategory.isPending;

  if (isEditing) {
    return (
      <li className="flex flex-col gap-3 rounded-xl border border-border/50 bg-background/50 p-4">
        <div className="space-y-2">
          <label
            htmlFor={`edit-${category.id}`}
            className="text-sm font-medium text-foreground"
          >
            Category Name
          </label>
          <Input
            id={`edit-${category.id}`}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            maxLength={50}
            disabled={isPending}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Color</span>
          <ColorPicker
            value={editColor}
            onChange={setEditColor}
            disabled={isPending}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isPending || !editName.trim()}
            size="sm"
          >
            {updateCategory.isPending ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isPending}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-4">
      <span
        className="size-4 shrink-0 rounded-full"
        style={{ backgroundColor: category.color ?? "#3b82f6" }}
        aria-hidden="true"
      />

      <span className="flex-1 text-sm font-medium text-foreground">
        {category.name}
      </span>

      <button
        onClick={() => setIsEditing(true)}
        type="button"
        className="text-muted-foreground transition-colors hover:text-foreground"
        aria-label={`Edit ${category.name}`}
        disabled={isPending}
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
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </button>

      <button
        onClick={handleDelete}
        type="button"
        className="text-muted-foreground transition-colors hover:text-destructive"
        aria-label={`Delete ${category.name}`}
        disabled={isPending}
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </li>
  );
}
