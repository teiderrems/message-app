import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import type { SearchUserDto, ChatItemDetailDto } from "@/types";
import ChatItem from "./chat-item";
import { useNavigate, useParams } from "react-router";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import UserSearchItem from "./user-search-item";
import { toast } from "sonner";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

export function NavMain({
  items,
  userId,
  refetch,
}: {
  items: ChatItemDetailDto[] | undefined;
  userId: number;
  refetch: () => Promise<any>;
}) {
  const { id } = useParams();
  if (!items) {
    return null;
  }
  const { mutateAsync } = useMutation(
    trpc.user.searchUserByQuery.mutationOptions()
  );

  const { mutateAsync: addChatAsync } = useMutation(
    trpc.chat.createChat.mutationOptions()
  );

  // const { mutateAsync: deleteChatAsync } = useMutation(
  //   trpc.chat.deleteChat.mutationOptions()
  // );
  const [searchUsers, setSearchUsers] = useState<SearchUserDto[]>([]);

  // const [chatToDelete, setChatToDelete] = useState<number>();

  const navigate = useNavigate();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && value.length > 3) {
      try {
        const res = await mutateAsync({ query: value });
        if (res) {
          console.log(res);
          setSearchUsers(res as SearchUserDto[]);
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      setSearchUsers([]);
    }
  };

  // const [confirmDialog, setConfirmDialog] = useState(false);

  const handleClic = async (id: number, username?: string | null) => {
    if (username) {
      const item = items.find((it) => it.title && username.includes(it.title));
      if (item) {
        navigate(`/chats/${item.id}`);
      }
    } else {
      try {
        const res = await addChatAsync({
          authorId: userId,
          destinatorId: id,
          description: "unknown",
        });
        await refetch();
        if (res) {
          toast("chat ajouté avec succes");
          navigate(`/chats/${res}`);
        }
        setSearchUsers([]);
      } catch (error) {
        console.log(error);
        toast((error as any).message);
        throw error;
      }
    }
  };

  // async function handleDelete(chatId: number) {
  //   try {
  //     const res = await deleteChatAsync({ id: chatId });
  //     if (res) {
  //       toast("chat supprimer avec succes", {
  //         closeButton: true,
  //         dismissible: true,
  //         duration: 5000,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast((error as any).message, {
  //       closeButton: true,
  //       dismissible: true,
  //       duration: 5000,
  //     });
  //     throw error;
  //   }
  // }

  // async function deleteChat() {
  //   if (chatToDelete) {
  //     await handleDelete(chatToDelete);
  //   }
  // }

  return (
    <>
      {/* <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous vraiment sur?</DialogTitle>
            <DialogDescription>
              Êtes-vous sur de vouloir supprimer cette conversation?. Tous les
              messages associés à la conversation seront supprimer
              définitivement
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={deleteChat} variant={"outline"}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu className="flex flex-col">
            <SidebarHeader>
              <h3 className="text-sm font-medium">Recent Chats</h3>
              <div className="flex border border-white rounded-full bg-gray-200 hover:border-gray-500 px-2 items-center">
                <Button
                  asChild
                  variant={"ghost"}
                  size={"icon"}
                  className="text-gray-600"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Input
                  type="search"
                  onInput={handleSearch}
                  placeholder="Search and start new chat here"
                  className="border-none placeholder:text-sm focus-visible:border-0 placeholder:text-gray-400 placeholder:italic"
                />
              </div>
            </SidebarHeader>
            {searchUsers.length === 0
              ? items.map((item) => (
                  <ChatItem
                    key={item.id}
                    userId={userId}
                    chat={item}
                    isActive={item.id === Number(id)}
                    // onDelete={(id) => setChatToDelete(id)}
                  />
                ))
              : searchUsers.map((u) => (
                  <UserSearchItem key={u.id} user={u} handleClic={handleClic} />
                ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
