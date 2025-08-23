import { Attachment, Profil, User } from "@/generated/prisma";
import { Request } from "express";
import { v4 } from "uuid";
import {
  ChatDetail,
  ChatDetailDto,
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
    createdAt: message.createdAt.toLocaleTimeString(),
    isViewed: message.isViewed,
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
      ? `${protocol}://${host}/api/avatars/${friend.user.Profil.id}`
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

const  getAvatar=(email:string)=>{
  const array= email.split("@")[0].split(".");
  if(array.length===1){
    return array[0].substring(0, 2).toLocaleUpperCase();
  }
  else{
    return array[0].substring(0, 1).toLocaleUpperCase()+array[1].substring(0, 1).toLocaleUpperCase();
  }
}

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
    updatedAt: user.updatedAt.toLocaleDateString(),
    createdAt: user.createdAt.toLocaleDateString(),
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
  convertUserDetailToUserDetailDto
};
