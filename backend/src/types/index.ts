type ChatDetail = {
  id: number;
  author: {
    id: number;
    username: string | null;
    Profil: {
      id: number;
    } | null;
  };
  messages: MessageDetail[];
} | null;

type ChatDetailDto = {
  id: number;
  author: {
    id: number;
    username: string | null;
    avatar?: string;
  };
  messages: MessageDetailDto[];
};

type MessageDetail = {
  id: number;
  content: string | null;
  createdAt: Date;
  isViewed: boolean;
  attachments: {
    id: number;
  }[];
  author: {
    id: number;
    username: string | null;
    email: string | null;
    Profil: {
      id: number;
    } | null;
  };
};

type MessageDetailDto = {
  id: number;
  content: string | null;
  createdAt: string;
  isViewed: boolean;
  attachments?: string[];
  author: {
    id: number;
    username: string | null;
    avatar?: string;
  };
};

type CreateMessageDto = {
  content: string | null;
  attachments?: string[];
  author: {
    id: number;
    username: string | null;
    avatar?: string;
  };
};

type UserFriendOfDetail = {
  friendOf: {
    id: number;
    user: {
      id: number;
      email: string | null;
      username: string | null;
      Profil: {
        id: number;
      } | null;
    };
  }[];
};

type UserFriendDetail = {
  friends: {
    id: number;
    user: {
      id: number;
      email: string | null;
      username: string | null;
      Profil: {
        id: number;
      } | null;
    };
  }[];
};

type UserFriendDetailDto = {
  id: number;
  username: string | null;
  avatar?: string;
}[];

type LoginDetail = {
  id: number;
  email: string | null;
  phone: string | null;
  firstname: string | null;
  lastname: string | null;
  updatedAt: Date;
  createdAt: Date;
  Profil: {
    id: number;
  } | null;
};

type LoginDetailDto = {
  id: number;
  email: string | null;
  phone: string | null;
  firstname: string | null;
  lastname: string | null;
  updatedAt: Date;
  createdAt: Date;
  avatar?: string;
};

type UserDetail={
    Profil: {
        id: number;
    } | null;
    id: number;
    email: string | null;
    phone: string | null;
    username: string | null;
    firstname: string | null;
    lastname: string | null;
    isOnline: boolean;
    updatedAt: Date;
    createdAt: Date;
}

type UserDetailDto={
    avatar?: string;
    id: number;
    email: string | null;
    phone: string | null;
    username: string | null;
    isOnline: boolean;
    firstname: string | null;
    lastname: string | null;
    updatedAt: string;
    createdAt: string;
}

type HistoryChatItem = {
  id: number;
  description: string | null;
  avatar?: string;
  updatedAt: string;
};

export type {
  ChatDetail,
  ChatDetailDto,
  MessageDetail,
  MessageDetailDto,
  CreateMessageDto,
  UserFriendDetail,
  UserFriendDetailDto,
  UserFriendOfDetail,
  LoginDetail,
  LoginDetailDto,
  UserDetail,
  UserDetailDto,
  HistoryChatItem
};
