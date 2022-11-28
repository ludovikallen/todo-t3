
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const todoItemRouter = router({
  postTodo: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.todoItem.create({
          data: {
            name: input.name,
            done: false,
            createdBy: ctx.session.user.id
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  completeTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.todoItem.update({
          where: {
            id: input.id
          },
          data: {
            done: input.done
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
      try {
        return await ctx.prisma.todoItem.findMany({
          where: {
            createdBy: ctx.session.user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } catch (error) {
        console.log("error", error);
      } 
    }),
  deleteTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.todoItem.delete({
          where: {
            id: input.id
          }
        });
      } catch (error) {
        console.log(error);
      }
    }),
});