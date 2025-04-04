"use client";

import { useRef, useState } from "react";
import ChatHistory from "./chat-history";
import ChatInput, { ChatInputHandle } from "./chat-input";
import { Message } from "@/app/lib/types";

interface ChatContainerProps {
    initialVisitorData: {
        exists: boolean;
        name: string;
        hasChat: boolean;
    };
}

export default function ChatContainer({ initialVisitorData }: ChatContainerProps) {
    const ref = useRef<ChatInputHandle>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [streamingMessage, setStreamingMessage] = useState<string>();

    const handleNewMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
    };

    const handleLoadHistory = (historicalMessages: Message[]) => {
        setMessages(historicalMessages);
    };

    const handleSendMessage = (message: string) => {
        ref.current?.sendMessage(message);
    };

    return (
        <>
            <div className="flex-1 p-4 bg-white dark:bg-gray-800">
                <ChatHistory
                    messages={messages}
                    streamingMessage={streamingMessage}
                    onLoadHistory={handleLoadHistory}
                    onSendMessage={handleSendMessage}
                    initialVisitorData={initialVisitorData}
                />
            </div>
            <div className="fixed bottom-0 w-full px-4 mx-auto -translate-x-1/2 bg-transparent md:w-1/2 left-1/2">
                <ChatInput ref={ref} onNewMessage={handleNewMessage} onStreamingMessage={setStreamingMessage} />
            </div>
        </>
    );
}
