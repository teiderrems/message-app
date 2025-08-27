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
import "dotenv/config";
import appRouter from "./trpc/app-router";
import UserService from "./services/user.service";

interface AuthSocket extends Socket {
  userId?: number;
  chatId?: number;
}

const host = process.env.HOST;
const protocol = process.env.PROTOCOL;

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
    createContext: () => ({}),
  })
);
app.use("/api/avatars", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use("/api/attachments", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use("/api/avatars", profilRouter);

app.use("/api/users", userRouter);

app.use("/api/chats", chatRouter);

app.use("/api/attachments", attachmentRouter);

app.use("/api/messages", messageRouter);

const sessions = new Map<string, string>();

io.on("connection", (socket: AuthSocket) => {
  console.log("Nouvelle connexion socket:", socket.id);

  // Écouter l'événement join_chat une seule fois
  socket.once(
    "join_chat",
    async ({ userId, chatId }: { userId: number; chatId: number }) => {
      socket.userId = userId;
      socket.chatId = chatId;
      const key = `${userId}:${chatId}`;

      console.log(
        `User ${userId} tente de rejoindre le chat ${chatId} avec socket ${socket.id}`
      );

      // Vérifier si l'utilisateur a le droit d'être dans le chat
      let isInChat = await ChatService.isUserInChat({ userId, chatId });
      if (!isInChat) {
        try {
          await ChatService.addUserToChat({ userId: [userId], chatId });
        } catch (error) {
          console.error("Erreur lors de l'ajout à la discussion:", error);
          socket.emit("error", { message: "Impossible de rejoindre le chat." });
          return socket.disconnect(); // ou mieux : refuser la connexion
        }
      }

      // Gérer les connexions multiples : déconnecter l'ancienne session
      if (sessions.has(key)) {
        const oldSocketId = sessions.get(key);
        const oldSocket = io.sockets.sockets.get(oldSocketId!);
        if (oldSocket) {
          console.log(
            `Déconnexion ancienne session pour user ${userId} dans chat ${chatId}`
          );
          oldSocket.leave(`chat_${chatId}`);
          oldSocket.disconnect(true);
        }
      }

      // Enregistrer la nouvelle session
      sessions.set(key, socket.id);

      // Rejoindre le salon
      await socket.join(`chat_${chatId}`);
      console.log(`User ${userId} a rejoint le salon chat_${chatId}`);

      // ✅ Maintenant que le salon est rejoint, on peut écouter les messages
      setupChatEventListeners(socket, chatId);
    }
  );

  // Fonction utilitaire pour attacher les listeners une fois dans le salon
  function setupChatEventListeners(socket: AuthSocket, chatId: number) {
    console.log(`User ${socket.userId} a rejoint le salon chat_${chatId}`);
    // Écouter les messages
    socket.on(
      "chat_message",
      async ({
        message,
        attachments,
      }: {
        message: Partial<Message>;
        attachments?: Omit<
          Attachment,
          "id" | "createdAt" | "updatedAt" | "messageId"
        >[];
      }) => {
        try {
          const data = await MessageService.addMessage({
            message,
            attachments,
          });
          if (message.chatId === socket.chatId) {
            io.to(`chat_${chatId}`).emit("chat_message", {
              message: convertMessageDetailToMessageDetailDto(
                protocol!,
                `${host}${PORT ? `:${PORT}` : ""}`,
                data
              ),
            });
            // Marquer comme reçu (pas encore lu)
            io.to(`chat_${chatId}`).emit("message_status", {
              messageId: data.id,
              isViewed: data.isViewed, // encore non lu
            });
          }
        } catch (err) {
          console.error("Erreur en envoyant le message:", err);
          io.to(`chat_${chatId}`).emit("error", {
            message: "Échec de l'envoi du message.",
          });
        }
      }
    );

    socket.on(
      "update_description",
      async ({ chatId, content }: { chatId: number; content: string }) => {
        try {
          await ChatService.updateChat({
            id: chatId,
            chat: {
              description: content,
            },
          });
          io.to(`chat_${chatId}`).emit("succes", {
            message: "La description du chat a été mise à jour avec succes.",
          });
        } catch (err) {
          console.error("Erreur en envoyant le message:", err);
          io.to(`chat_${chatId}`).emit("error", {
            message: "Échec de l'envoi du message.",
          });
        }
      }
    );

    // Écouter les événements de saisie
    socket.on(
      "user_typing",
      ({
        isTyping,
        chatId,
        userId,
        destinatorId,
      }: {
        isTyping: boolean;
        chatId: number;
        userId: number;
        destinatorId: number;
      }) => {
        const key = `${destinatorId}:${chatId}`;
        const socketId = sessions.get(key);
        const oldSocket = io.sockets.sockets.get(socketId!);
        oldSocket?.emit("user_typing", {
          chatId,
          isTyping,
          userId,
        });
        
        oldSocket?.emit("user_typing_indicator", {
          chatId,
          isTyping,
          userId,
        });
        
        oldSocket?.emit("user_typing_chat", {
          chatId,
          isTyping,
          userId,
        });
      }
    );

    // Lecture d’un message
    socket.on("read_message", async ({ messageId }: { messageId: number }) => {
      try {
        const isViewed = await MessageService.updateMessageIsViewed({
          id: messageId,
          userId: socket.userId!,
        });

        // Diffuser le statut dans le salon
        io.to(`chat_${chatId}`).emit("message_status", {
          messageId,
          isViewed,
        });
      } catch (err) {
        console.error("Erreur en marquant le message comme lu:", err);
      }
    });

    socket.on('user_online',async({userId,isOnline}:{userId:number,isOnline:boolean})=>{
      try {
        const res=await UserService.changeOnlineStatus({id:userId,isOnline});
      } catch (error) {
        console.log(error);
        throw error;
      }
    })

    socket.on("leave_chat", () => {
      const { userId, chatId } = socket;
      if (userId && chatId) {
        const key = `${userId}:${chatId}`;
        if (sessions.get(key) === socket.id) {
          sessions.delete(key);
        }
        // Optionnel : quitter le salon
        socket.leave(`chat_${chatId}`);
        console.log(`User ${userId} a quitté le chat ${chatId}`);
      }
    });
  }

  // Gestion de la déconnexion
  socket.on("disconnect", () => {
    const { userId, chatId } = socket;
    if (userId && chatId) {
      const key = `${userId}:${chatId}`;
      if (sessions.get(key) === socket.id) {
        sessions.delete(key);
      }
      // Optionnel : quitter le salon
      socket.leave(`chat_${chatId}`);
      console.log(`User ${userId} déconnecté du chat ${chatId}`);
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
