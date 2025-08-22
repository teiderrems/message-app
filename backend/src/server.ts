import express, { type Request, type Response } from "express";
import "dotenv/config";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import profilRouter from "@/routers/profil.router";
import userRouter from "@/routers/user.router";
import chatRouter from "@/routers/chat.router";
import attachmentRouter from "@/routers/attachment.router";
import messageRouter from "@/routers/message.router";
import helmet from "helmet";
import cors from "cors";
import MessageService from "./services/message.service";
import { Attachment, Message } from "./generated/prisma";
import { convertMessageDetailToMessageDetailDto } from "./util";
import ChatService from "./services/chat.service";
import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "@/trpc/router";
import { createContext } from "@/trpc/server";

interface AuthSocket extends Socket {
  userId?: number;
  chatId?: number;
}

const allowedOrigins: string[] = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ): void => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /\.ngrok-free\.app$/.test(new URL(origin).hostname)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.use('/api/avatars', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use('/api/attachments', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use("/api/avatars", profilRouter);

app.use("/api/users", userRouter);

app.use("/api/chats", chatRouter);

app.use("/api/attachments", attachmentRouter);

app.use("/api/messages", messageRouter);

const sessions = new Map<string, string>();

io.on("connection", (socket: AuthSocket) => {
  console.log("a user connected", socket.id);
  socket.on(
    "join_chat",
    async ({ userId, chatId }: { userId: number; chatId: number }) => {
      let key = "";
      if (await ChatService.isUserInChat({ userId, chatId })) {
        key = `${userId}:${chatId}`;
      } else {
        try {
          await ChatService.addUserToChat({ userId: [userId], chatId });
          key = `${userId}:${chatId}`;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
      // Vérification si l'utilisateur est dans le chat

      // Si déjà connecté sur ce chat, on ferme l’ancien
      if (sessions.has(key)) {
        const oldSocketId = sessions.get(key);
        const oldSocket = io.sockets.sockets.get(oldSocketId!);
        if (oldSocket) oldSocket.disconnect(true);
      }

      sessions.set(key, socket.id);
      socket.userId = userId;
      socket.chatId = chatId;

      socket.join(chatId.toLocaleString()); // rejoindre la "room"
      console.log(`User ${userId} connecté au chat ${chatId}`);
    }
  );

  // Envoi message dans un chat
  socket.on(
    "chat_message",
    async ({
      message,
      chatId,
      from,
      attachments,
    }: {
      chatId: number;
      from: number;
      message: Partial<Message>;
      attachments?: Omit<
        Attachment,
        "id" | "createdAt" | "updatedAt" | "messageId"
      >[];
    }) => {
      const url = new URL(socket.request.url || "");
      const protocol = url.protocol;
      const host = url.host;
      const data = await MessageService.addMessage({ message, attachments });
      io.to(chatId.toLocaleString()).emit("chat_message", {
        message: convertMessageDetailToMessageDetailDto(protocol, host, data),
      });
      socket.emit("message_status", { messageId: data.id, status: "sent" });
    }
  );

  // Lecture d’un message
  socket.on(
    "read_message",
    ({
      messageId,
      from,
      chatId,
    }: {
      messageId: number;
      from: number;
      chatId: number;
    }) => {
      // notifier l’émetteur dans la room
      io.to(chatId.toLocaleString()).emit("message_status", {
        messageId,
        status: "read",
        from,
      });
    }
  );

  // Déconnexion
  socket.on("disconnect", () => {
    if (socket.userId && socket.chatId) {
      const key = `${socket.userId}:${socket.chatId}`;
      sessions.delete(key);
      console.log(`User ${socket.userId} quitté le chat ${socket.chatId}`);
    }
  });
});

app.get("/", (req: Request, res: Response) => {
  // const profileData = convertFileToProfile(file);
  res.send("<h1>Hello world</h1>");
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
