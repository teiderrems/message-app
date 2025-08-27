import { router } from ".";
import { chatRouter, messageRouter, userRouter } from "./router";

const appRouter = router({
  user: userRouter,
  chat: chatRouter,
  message: messageRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
