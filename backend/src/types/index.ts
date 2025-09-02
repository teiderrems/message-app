type ChatDetail = {
  id: number;
  author: {
    id: number;
    username: string | null;
    Profil: {
      id: number;
      mimetype: string;
    } | null;
  };
  messages: MessageDetail[];
} | null;

type ChatDetailDto = {
  id: number;
  destinator: {
    id?: number;
    username?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
  messages: MessageDetailDto[];
};

type DestinatorDto = {
  id: number;
  email: string | null;
  username: string | null;
  avatar?: string | null;
};

type MessageDetail = {
  id: number;
  content: string | null;
  createdAt: Date;
  isViewed: boolean;
  replyMessageId?: number | null;
  attachments: {
    id: number;
    mimetype: string;
    isVoice?: boolean | null;
    duration?: number | null;
  }[];
  author: {
    id: number;
    username: string | null;
    email: string | null;
    Profil: {
      id: number;
      mimetype: string;
    } | null;
  };
};

type MessageDetailDto = {
  id: number;
  content: string | null;
  createdAt: string;
  isViewed: boolean;
  replyMessageId?: number | null;
  attachments?: string[];
  author: {
    id: number;
    username: string | null;
    email: string | null;
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
        mimetype: string;
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
        mimetype: string;
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
    mimetype: string;
  } | null;
};

type LoginDetailDto = {
  id: number;
  email: string | null;
  phone: string | null;
  firstname: string | null;
  lastname: string | null;
  updatedAt: string;
  createdAt: string;
  avatar?: string;
};

type UserDetail = {
  Profil: {
    id: number;
    mimetype: string;
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
};

type UserDetailDto = {
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
};

type HistoryChatItem = {
  id: number;
  description: string | null;
  avatar?: string;
  updatedAt: string;
};

type ChatItemDetail = {
  messages: {
    isViewed: boolean;
    author: {
      id: number;
      username: string | null;
      email: string | null;
      Profil: {
        id: number;
        mimetype: string;
      } | null;
    };
  }[];
} & {
  id: number;
  description: string | null;
  authorId: number;
  updatedAt: Date;
  createdAt: Date;
};

type ChatItemDetailDto = {
  id: number;
  description: string | null;
  authorId: number;
  updatedAt: string;
  createdAt: string;
  title: string | null;
  isRead?: boolean;
  avatar?: string;
};

type SearchUserDto = {
  id: number;
  email: string | null;
  username: string | null;
  createdAt: Date;
  avatar: string;
  isOnline: boolean;
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
  HistoryChatItem,
  DestinatorDto,
  ChatItemDetail,
  ChatItemDetailDto,
  SearchUserDto,
};
