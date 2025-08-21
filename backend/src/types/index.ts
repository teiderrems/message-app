type ChatDetail = {
  id: number;
  author: {
    id: number;
    username: string | null;
    Profil: {
      id: number;
    } | null;
  };
  messages: {
    id: number;
    content: string | null;
    createdAt: Date;
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
  }[];
} | null;

type ChatDetailDto = {
  id: number;
  author: {
    id: number;
    username: string | null;
    avatar?: string;
  };
  messages: {
    id: number;
    content: string | null;
    createdAt: Date;
    attachments?: string[];
    author: {
      id: number;
      username: string | null;
      avatar?: string;
    };
  }[];
};

type MessageDetail = {
  id: number;
  content: string | null;
  createdAt: Date;
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
  createdAt: Date;
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

type UserFriendDetail = {
  friends: {
    id: number;
    username: string | null;
    email: string | null;
    Profil: {
      id: number;
    } | null;
  }[];
};

type UserFriendDetailDto = {
  id: number;
  username: string | null;
  avatar?: string;
}[];


type LoginDetail={
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
}

type LoginDetailDto = {
    id: number;
    email: string | null;
    phone: string | null;
    firstname: string | null;
    lastname: string | null;
    updatedAt: Date;
    createdAt: Date;
    avatar?: string;
}

export type {
  ChatDetail,
  ChatDetailDto,
  MessageDetail,
  MessageDetailDto,
  CreateMessageDto,
  UserFriendDetail,
  UserFriendDetailDto,
  LoginDetail,
  LoginDetailDto
};
