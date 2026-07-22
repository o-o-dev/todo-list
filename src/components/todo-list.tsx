"use client";

import { useState } from "react";
import { api } from "todo/trpc/react";
import { Input } from "todo/components/ui/input";

import { type BatchState, type LocalTodoState } from "./interfaces";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function TodoList() {
  const utils = api.useUtils();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isBatchMode, setBatchMode] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [batchState, setBatchState] = useState<BatchState>({
    pendingUpdates: {},
    pendingDeletes: new Set(),
  });

  // Derived state
  const hasPendingChanges =
    Object.keys(batchState.pendingUpdates).length > 0 ||
    batchState.pendingDeletes.size > 0;
  const pendingUpdatesCount = Object.keys(batchState.pendingUpdates).length;
  const pendingDeletesCount = batchState.pendingDeletes.size;

  const { data, isLoading } = api.todo.getAll.useQuery();
  const todos = data ?? [];

  const toggleTodo = api.todo.toggle.useMutation({
    onSuccess: () => {
      void utils.todo.getAll.invalidate();
    },
  });
  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => {
      void utils.todo.getAll.invalidate();
    },
  });

  const updateTodo = api.todo.update.useMutation({
    onSuccess: () => {
      setEditingId(null);
      setEditContent("");
      void utils.todo.getAll.invalidate();
    },
  });

  const batchTodo = api.todo.batch.useMutation({
    onSuccess: () => {
      setBatchState({ pendingUpdates: {}, pendingDeletes: new Set() });
      void utils.todo.getAll.invalidate();
    },
  });

  const startEditing = (id: string, content: string) => {
    setEditingId(id);
    // In batch mode, use pending content if it exists
    const pendingContent = batchState.pendingUpdates[id]?.content;
    setEditContent(pendingContent ?? content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
  };

  const updateLocal = (id: string, changes: Partial<LocalTodoState>) => {
    setBatchState((prev) => ({
      ...prev,
      pendingUpdates: {
        ...prev.pendingUpdates,
        [id]: { ...prev.pendingUpdates[id], ...changes },
      },
    }));
  };

  const markForDelete = (id: string) => {
    setBatchState((prev) => ({
      ...prev,
      pendingDeletes: new Set(prev.pendingDeletes).add(id),
    }));
  };

  const unmarkForDelete = (id: string) => {
    setBatchState((prev) => {
      const newDeletes = new Set(prev.pendingDeletes);
      newDeletes.delete(id);
      return { ...prev, pendingDeletes: newDeletes };
    });
  };

  const discardChanges = () => {
    setBatchState({ pendingUpdates: {}, pendingDeletes: new Set() });
  };

  const handleModeToggle = () => {
    if (isBatchMode && hasPendingChanges) {
      setShowExitWarning(true);
      return;
    }
    setBatchMode((prev) => !prev);
  };

  const handleDiscardAndExit = () => {
    discardChanges();
    setBatchMode(false);
    setShowExitWarning(false);
  };

  const saveEdit = (id: string) => {
    const trimmed = editContent.trim();
    if (!trimmed) return;
    updateTodo.mutate({ id, content: trimmed });
  };

  const submitBatch = () => {
    if (!hasPendingChanges) return;

    batchTodo.mutate({
      updates: Object.entries(batchState.pendingUpdates)
        .filter(([, state]) => state.content !== undefined)
        .map(([id, state]) => ({
          id,
          content: state.content!,
        })),
      deleteIds: Array.from(batchState.pendingDeletes),
      toggleIds: Object.entries(batchState.pendingUpdates)
        .filter(([, state]) => state.isCompleted != undefined)
        .map(([id]) => id),
    });
  };

  if (isLoading) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Task count and mode toggle */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            {todos.length} {todos.length === 1 ? "task" : "tasks"}
          </span>
          {isBatchMode && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Batch Mode
            </span>
          )}
        </div>
        <div>
          <Button
            onClick={handleModeToggle}
            size="default"
            aria-pressed={isBatchMode}
            variant={isBatchMode ? "default" : "outline"}
          >
            {isBatchMode ? "Exit Batch Mode" : "Batch Mode"}
          </Button>
        </div>
      </div>

      {/* Todo list */}
      {todos.length > 0 ? (
        <ul className="space-y-3">
          {todos.map((todo) => {
            const isPendingDelete = batchState.pendingDeletes.has(todo.id);
            const isPendingUpdate = Boolean(batchState.pendingUpdates[todo.id]);

            return (
              <li
                key={todo.id}
                className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                  isPendingDelete
                    ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/50"
                    : isPendingUpdate
                      ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50"
                      : "border-border/50 bg-background/50"
                }`}
              >
                <button
                  onClick={() => {
                    if (isBatchMode) {
                      updateLocal(todo.id, {
                        isCompleted: !(
                          batchState.pendingUpdates[todo.id]?.isCompleted ??
                          todo.isCompleted
                        ),
                      });
                    } else {
                      toggleTodo.mutate({ id: todo.id });
                    }
                  }}
                  type="button"
                  className={`size-5 rounded-full border-2 transition-colors ${
                    (batchState.pendingUpdates[todo.id]?.isCompleted ??
                    todo.isCompleted)
                      ? "border-primary bg-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                  aria-label={
                    todo.isCompleted
                      ? "Mark task as incomplete"
                      : "Mark task as complete"
                  }
                >
                  {(batchState.pendingUpdates[todo.id]?.isCompleted ??
                    todo.isCompleted) && (
                    <svg
                      className="text-primary-foreground size-full p-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>

                {editingId === todo.id ? (
                  /* Edit mode */
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (isBatchMode) {
                            updateLocal(todo.id, {
                              content: editContent,
                            });
                            cancelEditing();
                          } else {
                            saveEdit(todo.id);
                          }
                        }
                        if (e.key === "Escape") cancelEditing();
                      }}
                      className="h-8 flex-1 text-sm"
                      maxLength={256}
                      autoFocus
                      disabled={
                        isBatchMode ? batchTodo.isPending : updateTodo.isPending
                      }
                      aria-label="Edit task content"
                    />
                    {/* Save button */}
                    <button
                      onClick={() => {
                        if (isBatchMode) {
                          updateLocal(todo.id, { content: editContent });
                          cancelEditing();
                        } else {
                          saveEdit(todo.id);
                        }
                      }}
                      type="button"
                      className="text-muted-foreground transition-colors hover:text-green-500"
                      aria-label="Save edit"
                      disabled={
                        isBatchMode ? batchTodo.isPending : updateTodo.isPending
                      }
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    {/* Cancel button */}
                    <button
                      onClick={cancelEditing}
                      type="button"
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Cancel edit"
                      disabled={
                        isBatchMode ? batchTodo.isPending : updateTodo.isPending
                      }
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
                  </div>
                ) : (
                  /* View mode */
                  <>
                    <div className="flex flex-1 items-center gap-2">
                      <span
                        className={`flex-1 text-sm ${
                          isPendingDelete
                            ? "text-red-500 line-through dark:text-red-400"
                            : (batchState.pendingUpdates[todo.id]
                                  ?.isCompleted ?? todo.isCompleted)
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                        }`}
                      >
                        {batchState.pendingUpdates[todo.id]?.content ??
                          todo.content}
                      </span>

                      <time
                        dateTime={todo.createdAt.toISOString()}
                        title={todo.createdAt.toLocaleString()}
                        className="text-muted-foreground shrink-0 text-xs"
                        aria-label={`Created on ${todo.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`}
                      >
                        {todo.createdAt.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      {/* Pending update badge */}
                      {isPendingUpdate && !isPendingDelete && (
                        <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                          Edited
                        </span>
                      )}

                      {/* Pending delete badge with undo */}
                      {isPendingDelete && (
                        <button
                          onClick={() => unmarkForDelete(todo.id)}
                          type="button"
                          className="rounded-full bg-red-200 px-2 py-0.5 text-xs font-medium text-red-800 transition-colors hover:bg-red-300 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
                          aria-label="Undo delete"
                        >
                          Undo
                        </button>
                      )}
                    </div>

                    {/* Edit button - hidden if pending delete */}
                    {!isPendingDelete && (
                      <button
                        onClick={() => startEditing(todo.id, todo.content)}
                        type="button"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Edit task"
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
                    )}

                    {/* Delete button - hidden if already pending delete */}
                    {!isPendingDelete && (
                      <button
                        onClick={() =>
                          isBatchMode
                            ? markForDelete(todo.id)
                            : deleteTodo.mutate({ id: todo.id })
                        }
                        type="button"
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={
                          isBatchMode ? "Mark task for deletion" : "Delete task"
                        }
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
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-muted-foreground py-8 text-center text-sm">
          <p>No tasks yet</p>
          <p className="mt-1 text-xs">Add your first task to get started</p>
        </div>
      )}
      {isBatchMode && hasPendingChanges && (
        <div
          className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950"
          role="status"
          aria-live="polite"
        >
          <span className="text-sm text-amber-800 dark:text-amber-200">
            {pendingUpdatesCount > 0 &&
              `${pendingUpdatesCount} edit${pendingUpdatesCount !== 1 ? "s" : ""}`}
            {pendingUpdatesCount > 0 && pendingDeletesCount > 0 && ", "}
            {pendingDeletesCount > 0 &&
              `${pendingDeletesCount} delete${pendingDeletesCount !== 1 ? "s" : ""}`}
            {" pending"}
          </span>
          <div className="flex gap-2">
            <Button onClick={discardChanges} variant="outline" size="sm">
              Discard
            </Button>
            <Button
              onClick={submitBatch}
              size="sm"
              disabled={batchTodo.isPending}
            >
              {batchTodo.isPending ? "Submitting..." : "Submit Changes"}
            </Button>
          </div>
        </div>
      )}

      {/* Exit batch mode warning dialog */}
      <AlertDialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have{" "}
              {pendingUpdatesCount > 0 &&
                `${pendingUpdatesCount} edit${pendingUpdatesCount !== 1 ? "s" : ""}`}
              {pendingUpdatesCount > 0 && pendingDeletesCount > 0 && " and "}
              {pendingDeletesCount > 0 &&
                `${pendingDeletesCount} delete${pendingDeletesCount !== 1 ? "s" : ""}`}{" "}
              pending. Exiting batch mode will discard all unsaved changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDiscardAndExit}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard & Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
