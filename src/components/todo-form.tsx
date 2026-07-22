"use client";

import { useState } from "react";
import { api } from "todo/trpc/react";
import { Button } from "todo/components/ui/button";
import { Input } from "todo/components/ui/input";
import { CategorySelect } from "todo/components/category-select";

export function TodoForm() {
  const utils = api.useUtils();
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const createTodo = api.todo.create.useMutation({
    onSuccess: () => {
      setContent("");
      setCategoryId(null);
      void utils.todo.getAll.invalidate();
    },
  });

  const isPending = createTodo.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) return;
    createTodo.mutate({ content: trimmed, categoryId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          className="flex-1"
          maxLength={256}
          aria-label="New task content"
        />
        <Button
          type="submit"
          disabled={isPending || !content.trim()}
          size="default"
        >
          {isPending ? "Adding..." : "Add"}
        </Button>
      </div>
      <CategorySelect
        value={categoryId}
        onChange={setCategoryId}
        disabled={isPending}
      />
    </form>
  );
}
