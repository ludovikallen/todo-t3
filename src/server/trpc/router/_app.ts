import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { todoItemRouter } from "./todoItem";

export const appRouter = router({
  todoItem: todoItemRouter,
  example: exampleRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
