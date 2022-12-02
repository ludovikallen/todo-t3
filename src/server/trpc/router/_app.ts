import { router } from "../trpc";
import { authRouter } from "./auth";
import { todoItemRouter } from "./todoItem";

export const appRouter = router({
  todoItem: todoItemRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
