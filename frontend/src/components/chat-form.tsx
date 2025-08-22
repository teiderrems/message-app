import { Mic, Paperclip, SendHorizontal, Smile } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface Props {
  onSendMessage: (message: string) => void;
  message?: string;
}

function ChatForm(props: Props) {
  const { onSendMessage, message } = props;

  const [inputMessage, setInputMessage] = useState(message || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendMessage(inputMessage);
  };

  return (
    <form
      className="bg-white border-t border-gray-200 px-4 py-3"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center space-x-2 p-2 mx-auto bg-white rounded-full">
        <Button
          asChild
          className="hover:cursor-pointer border-0 sm:h-10 sm:w-10 p-2 flex bg-white text-gray-600 hover:bg-gray-400 items-center justify-center  rounded-full hover:text-white transition"
        >
          <Paperclip className="h-full sm:w-fit" />
        </Button>
        <Button
          asChild
          className="hover:cursor-pointer border-0 sm:h-10 sm:w-10 p-2 flex bg-white text-gray-600 hover:bg-gray-400 items-center justify-center  rounded-full hover:text-white transition"
        >
          <Smile className="h-full sm:w-fit" />
        </Button>

        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Écrire un message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="w-full bg-gray-100 h-12 rounded-full placeholder:italic px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {!inputMessage ? (
          <Button
            asChild
            className=" hover:cursor-pointer border-0 sm:h-10 sm:w-10 p-2 flex items-center justify-center bg-white text-gray-600 hover:bg-green-600  rounded-full hover:text-white transition"
          >
            <Mic className="h-full sm:w-fit" />
          </Button>
        ) : (
          <Button
            type="submit"
            asChild
            className="hover:cursor-pointer border-0 sm:h-10 sm:w-10 p-2 flex items-center text-white bg-green-600 hover:bg-green-600 justify-center  rounded-full hover:text-white transition"
          >
            <SendHorizontal className="h-full sm:w-fit" />
          </Button>
        )}
      </div>
    </form>
  );
}

export default ChatForm;
