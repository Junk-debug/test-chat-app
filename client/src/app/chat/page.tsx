"use client";

import Message, { MessageData } from "@/components/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { SendHorizontal, Smile } from "lucide-react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5500");

type User = {
  name: string;
  roomId: string;
};

type UsersData = {
  roomId: string;
  users: User[];
};

export default function Chat() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const username = searchParams.get("username");
  const roomId = searchParams.get("roomId");

  const [currentMessage, setCurrentMessage] = useState("");

  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    if (username && roomId) {
      socket.emit("join", {
        username,
        roomId,
      });
    } else {
      notFound();
    }

    // const handleBeforeUnload = () => {
    //   socket.disconnect();
    // };

    // window.addEventListener("beforeunload", handleBeforeUnload);

    // return () => {
    //   window.removeEventListener("beforeunload", handleBeforeUnload);
    // };
  }, [roomId, username]);

  useEffect(() => {
    socket.on("message", ({ data }: { data: MessageData }) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    socket.on("roomInfo", ({ data: { users } }: { data: UsersData }) => {
      setUsersCount(users.length);
    });

    return () => {
      socket.off("roomInfo");
    };
  }, []);

  const addEmoji = (emoji: EmojiClickData) => {
    setCurrentMessage((prev) => prev + emoji.emoji);
  };

  const sendMessage = () => {
    const message = currentMessage.trim();

    if (!message) {
      return;
    }

    socket.emit("sendMessage", {
      message: message,
      params: { name: username, roomId },
    });

    setCurrentMessage("");
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const leaveRoom = () => {
    // socket.emit("leave", { params: { name: username, roomId } });
    socket.disconnect();
    router.push("/");
  };

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center justify-center p-4 md:px-24 py-32 gap-4">
      <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
        <div className="flex flex-col justify-between w-full h-full">
          <div className="w-full h-20 flex p-4 justify-between items-center border-b">
            <div className="flex flex-col">
              <p className="text-lg font-bold">Chat: {roomId}</p>
              <p className="text-sm">Total users: {usersCount}</p>
            </div>

            <Button onClick={leaveRoom} variant="destructive">
              Leave
            </Button>
          </div>

          <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
            <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
              {messages.map((message, index) => {
                const isFromMe = message.user.name === username;

                return (
                  <Message key={index} message={message} isFromMe={isFromMe} />
                );
              })}
            </div>
            <div className="p-2 flex justify-between w-full items-center gap-2">
              <div className="w-full relative flex">
                <Input
                  placeholder="Type something"
                  className="rounded-full w-full"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={onEnter}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      <Smile />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="w-full">
                    <EmojiPicker onEmojiClick={addEmoji} />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                onClick={sendMessage}
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SendHorizontal />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
