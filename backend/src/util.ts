import { Attachment, Profil, User } from "@/generated/prisma";
import { Request } from "express";
import { v4 } from "uuid";
import {
  ChatDetail,
  ChatDetailDto,
  LoginDetail,
  LoginDetailDto,
  MessageDetail,
  MessageDetailDto,
  UserFriendDetail,
  UserFriendDetailDto,
} from "./types";
import { genSaltSync, hashSync } from "bcrypt";
import { email } from "zod";

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

const setPassword = (user: Partial<User>): Partial<User> => {
  const salt = genSaltSync(10);
  if (user.password) {
    user.password = hashSync(user.password, salt);
  }
  return user;
};

const convertFileToAttachment = (
  req: Request
): Omit<Attachment, "id" | "createdAt" | "updatedAt" | "messageId">[] | [] => {
  const files = req.files;
  if (!files || files.length === 0) {
    return [];
  }

  const attachments: Omit<
    Attachment,
    "id" | "createdAt" | "updatedAt" | "messageId"
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
  chat: ChatDetail
): ChatDetailDto | null => {
  if (!chat) {
    return null;
  }

  return {
    id: chat.id,
    author: {
      id: chat.author.id,
      username: chat.author.username,
      avatar: chat.author.Profil?.id
        ? `${protocol}://${host}/api/avatars/${chat.author.Profil.id}`
        : chat.author.username?.substring(0, 2).toLocaleUpperCase(),
    },
    messages: chat.messages.map((message) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      attachments: message.attachments.map(
        (attachment) => `${protocol}://${host}/api/attachments/${attachment.id}`
      ),
      author: {
        id: message.author.id,
        username: message.author.username,
        avatar: message.author.Profil?.id
          ? `${protocol}://${host}/api/avatars/${message.author.Profil.id}`
          : getAvatar(message.author.email || "guest@gmail.com"),
      },
    })),
  };
};

const convertMessageDetailToMessageDetailDto = (
  protocol: string,
  host: string,
  message: MessageDetail
): MessageDetailDto | null => {
  if (!message) {
    return null;
  }

  return {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt,
    attachments: message.attachments.map(
      (attachment) => `${protocol}://${host}/api/attachments/${attachment.id}`
    ),
    author: {
      id: message.author.id,
      username: message.author.username,
      avatar: message.author.Profil?.id
        ? `${protocol}://${host}/api/avatars/${message.author.Profil.id}`
        : getAvatar(message.author.email || "guest@gmail.com"),
    },
  };
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
    username: friend.username,
    avatar: friend.Profil?.id
      ? `${protocol}://${host}/api/avatars/${friend.Profil.id}`
      : getAvatar(friend.email || "guest@gmail.com"),
  }));
};

const convertLoginDetailToLoginDetailDto = (
  protocol: string,
  host: string,
  login: LoginDetail
): LoginDetailDto | null => {
  if (!login) {
    return null;
  }

  return {
    id: login.id,
    email: login.email,
    phone: login.phone,
    firstname: login.firstname,
    lastname: login.lastname,
    updatedAt: login.updatedAt,
    createdAt: login.createdAt,
    avatar: login.Profil?.id
      ? `${protocol}://${host}/api/avatars/${login.Profil.id}`
      : getAvatar(login.email || "guest@gmail.com"),
  };
};

const  getAvatar=(email:string)=>{
  const array= email.split("@")[0].split(".");
  if(array.length===1){
    return array[0].substring(0, 2).toLocaleUpperCase();
  }
  else{
    return array[0].substring(0, 1).toLocaleUpperCase()+array[1].substring(0, 1).toLocaleUpperCase();
  }
}


export {
  convertFileToProfile,
  convertFileToAttachment,
  convertChatDetailToChatDetailDto,
  convertMessageDetailToMessageDetailDto,
  setPassword,
  convertUserFriendDetailToUserFriendDetailDto,
  convertLoginDetailToLoginDetailDto,
};
