import { auth } from "todo/server/auth";
import { api, HydrateClient } from "todo/trpc/server";

export default async function Home() {
  const session = await auth();
  const todos = await api.todo.getAll();

  if (session?.user) {
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <p className="">
          {session ? session?.user.username : "No user logged in"}
        </p>

        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.content}</li>
          ))}
        </ul>
      </main>
    </HydrateClient>
  );
}
