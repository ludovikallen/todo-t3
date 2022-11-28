import type { TodoItem } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const TodosList = () => {
  const { data: todos, isLoading } = trpc.todoItem.getAll.useQuery();

  if (isLoading) return <div>Fetching todos...</div>;

  return (
    <div className="flex flex-col gap-4">
      {todos?.map((todo, index) => {
        return (
          <Todo key={index} index={index} todo={todo} />
        );
      })}
    </div>
  );
};

const Form = () => {
  const [todo, setTodo] = useState("");
  const utils = trpc.useContext();
  
  const postTodo = trpc.todoItem.postTodo.useMutation({
    onSettled: () => {
      utils.todoItem.getAll.invalidate();
    },
  });

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        postTodo.mutate({
          name: todo,
        });
        setTodo("");
      }}
    >
      <input
        type="text"
        value={todo}
        placeholder="Your todo..."
        minLength={2}
        maxLength={100}
        onChange={(event) => setTodo(event.target.value)}
        className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
};



const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="pt-4 text-3xl">Guestbook</h1>
      <p>
        Tutorial for <code>create-t3-app</code>
      </p>
      <div className="pt-10">
        <div>
          {session ? (
            <>
              <p>hi {session.user?.name}</p>
              <button onClick={() => signOut()}>Logout</button>
              <div className="pt-6">
                <Form />
              </div>
            </>
          ) : (
            <button onClick={() => signIn("discord")}>
              Login with Discord
            </button>
          )}
          <div className="pt-10">
            <TodosList />
          </div>
        </div>
      </div>
    </main>
  );
};
export default Home;

interface TodoProps {
  index: number;
  todo: TodoItem;
}

const Todo = ({index, todo}: TodoProps) => {
  const [isChecked, setIsChecked] = useState(todo.done);
  const utils = trpc.useContext();

  const completeTodo = trpc.todoItem.completeTodo.useMutation({
    onSettled: () => {
      utils.todoItem.getAll.invalidate();
    },
  });

  const deleteTodo = trpc.todoItem.deleteTodo.useMutation({
    onSettled: () => {
      utils.todoItem.getAll.invalidate();
    },
  });

  return (
  <div key={index} className="form-control">
    <label className="flex space-x-4 label cursor-pointer">
      <input onClick={() => {
          setIsChecked(!isChecked);
          completeTodo.mutate({ id: todo.id, done: !todo.done });
      }}
      type="checkbox" checked={isChecked} className="flex-none checkbox checkbox-primary" />
      <span className="flex-initial label-text w-64">{todo.name}</span>
      <button onClick={() => {
        deleteTodo.mutate({id: todo.id});
      }} 
      className="btn btn-square btn-outline h-4 w-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </label>
  </div>
  );
}

