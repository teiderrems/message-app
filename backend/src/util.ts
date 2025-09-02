import { Attachment, Profil, User } from "@/generated/prisma";
import { Request } from "express";
import { v4 } from "uuid";
import {
  ChatDetail,
  ChatDetailDto,
  ChatItemDetail,
  ChatItemDetailDto,
  MessageDetail,
  MessageDetailDto,
  UserDetail,
  UserDetailDto,
  UserFriendDetail,
  UserFriendDetailDto,
  UserFriendOfDetail,
} from "./types";
import { genSaltSync, hashSync } from "bcrypt";

const convertFileToProfile = (
  req: Request
): Omit<Profil, "id" | "createdAt" | "updatedAt" | "userId"> | undefined => {
  const file = req.file;
  if (!file) {
    return undefined;
  }

  return {
    data: file.buffer,
    mimetype: file.mimetype,
    filename: `${v4()}-${file.originalname}`,
  };
};

const setPassword = (user: Partial<User>, newPassword?: string): Partial<User> => {
  const salt = genSaltSync(10);
  if (newPassword) {
    user.password = hashSync(newPassword, salt);
  }
  else if (!user.password) {
    user.password = hashSync("defaultPassword", salt);
  }
  else{
    user.password = hashSync(user.password, salt);
  }
  return user;
};

const convertFileToAttachment = (
  req: Request
): Omit<Attachment, "id" | "createdAt" | "updatedAt" | "messageId"| "size"| "duration"| "isVoice">[] | [] => {
  const files = req.files;
  if (!files || files.length === 0) {
    return [];
  }

  const attachments: Omit<
    Attachment,
    "id" | "createdAt" | "updatedAt" | "messageId"| "size"| "duration"| "isVoice"
  >[] = [];

  if (Array.isArray(files)) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      attachments.push({
        data: file?.buffer!,
        mimetype: file?.mimetype as string,
        filename: `${v4()}-${file?.originalname}`,
      });
    }
  }
  return attachments;
};

const convertChatDetailToChatDetailDto = (
  protocol: string,
  host: string,
  chat: ChatDetail,
  userId: number
): ChatDetailDto | null => {
  if (!chat) {
    return null;
  }

  const destinator=chat.messages.find(message=>message.author.id!==userId)?.author;

  return {
    id: chat.id,
    destinator: {
      id: destinator?.id,
      email: destinator?.email,
      avatar: destinator?.Profil?.id
        ? `${protocol}://${host}/api/avatars/${destinator.Profil.id}?mimetype=${destinator.Profil.mimetype}`
        : getAvatar(destinator?.email || "guest@gmail.com"),
    },
    messages: chat.messages.map((message) => convertMessageDetailToMessageDetailDto(protocol, host, message)),
  };
};

const convertMessageDetailToMessageDetailDto = (
  protocol: string,
  host: string,
  message: MessageDetail
): MessageDetailDto=> {
  return {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt.toLocaleString('fr-FR'),
    isViewed: message.isViewed,
    replyMessageId:message.replyMessageId,
    attachments: message.attachments.map(
      (attachment) => `${protocol}://${host}/api/attachments/${attachment.id}?mimetype=${attachment.mimetype}${attachment.isVoice?`&duration=${attachment.duration}`:''}`
    ),
    author: {
      id: message.author.id,
      username: message.author.username,
      email:message.author.email,
      avatar: message.author.Profil?.id
        ? `${protocol}://${host}/api/avatars/${message.author.Profil.id}?mimetype=${message.author.Profil.mimetype}`
        : getAvatar(message.author.email || "guest@gmail.com"),
    },
  };
};

const convertUserFriendOfDetailToUserFriendDetailDto = (
  protocol: string,
  host: string,
  userFriendDetail?: UserFriendOfDetail | null
): UserFriendDetailDto => {
  if (!userFriendDetail) {
    return [];
  }

  return userFriendDetail.friendOf.map((friend) => ({
    id: friend.id,
    username: friend.user.username,
    avatar: friend.user.Profil?.id
      ? `${protocol}://${host}/api/avatars/${friend.user.Profil.id}?mimetype=${friend.user.Profil.mimetype}`
      : getAvatar(friend.user.email || "guest@gmail.com"),
  }));
};

const convertUserFriendDetailToUserFriendDetailDto = (
  protocol: string,
  host: string,
  userFriendDetail?: UserFriendDetail | null
): UserFriendDetailDto => {
  if (!userFriendDetail) {
    return [];
  }

  return userFriendDetail.friends.map((friend) => ({
    id: friend.id,
    username: friend.user.username,
    avatar: friend.user.Profil?.id
      ? `${protocol}://${host}/api/avatars/${friend.user.Profil.id}`
      : getAvatar(friend.user.email || "guest@gmail.com"),
  }));
};

const getAvatar = (email: string): string => {
  if (!email || !email.includes("@")) return "U";

  const username = email.split("@")[0].trim();
  if (!username) return "U";

  // Découper par . ou -
  const parts = username.split(/[.\-_]/).filter(Boolean);

  if (parts.length === 1) {
    // Si un seul mot : prendre les 2 premières lettres
    return parts[0].substring(0, 2).toUpperCase();
  }

  // Si plusieurs parties : prendre la première lettre des deux premiers segments
  return (parts[0][0] + parts[1][0]).toUpperCase();
};


const convertUserDetailToUserDetailDto=(protocol: string, host: string, user: UserDetail): UserDetailDto | null => {
  if (!user) {
    return null;
  }
  return {
    avatar: user.Profil?.id
      ? `${protocol}://${host}/api/avatars/${user.Profil.id}`
      : getAvatar(user.email || "guest@gmail.com"),
    id: user.id,
    email: user.email,
    phone: user.phone,
    isOnline: user.isOnline,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    updatedAt: user.updatedAt.toLocaleString('fr-FR'),
    createdAt: user.createdAt.toLocaleString('fr-FR'),
  };
};

const convertChatItemDetailToChatItemDetailDto = (
  protocol: string,
  host: string,
  chatItem: ChatItemDetail,
  userId: number
): ChatItemDetailDto => {
  const destinator = chatItem.messages.find((message) => message.author.id !== userId)?.author;
  const last_message=chatItem.messages.at(-1);
  let avatar = "";
  if (destinator?.Profil?.id) {
    avatar = `${protocol}://${host}/api/avatars/${destinator.Profil.id}`;
  } else {
    avatar = getAvatar(destinator?.email || "guest@gmail.com");
  }

  return {
    id: chatItem.id,
    description: chatItem.description,
    authorId: chatItem.authorId,
    updatedAt: chatItem.updatedAt.toString(),
    createdAt: chatItem.createdAt.toString(),
    title: destinator?.username || destinator?.email?.split('@')[0] || "Unknown",
    isRead:last_message?.isViewed,
    avatar: avatar,
  };
};

export {
  convertFileToProfile,
  convertFileToAttachment,
  convertChatDetailToChatDetailDto,
  convertMessageDetailToMessageDetailDto,
  setPassword,
  convertUserFriendDetailToUserFriendDetailDto,
  convertUserFriendOfDetailToUserFriendDetailDto,
  convertUserDetailToUserDetailDto,
  convertChatItemDetailToChatItemDetailDto,
  getAvatar
};
