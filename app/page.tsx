"use client";

import { useRef, useState } from "react";
import { Suspense } from "react";
import ChatHistory from "./components/chat/chat-history";
import ChatInput, { ChatInputHandle } from "./components/chat/chat-input";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { Message } from "./lib/types";

export default function Home() {
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
        <main className="flex flex-col flex-1 basis-0 bg-gray-50 dark:bg-gray-900">
            {/* 채팅 섹션 */}
            <div className="flex flex-col flex-1 w-full p-4 mx-auto md:w-1/2 basis-0">
                <div className="flex-1 p-4 overflow-y-auto bg-white rounded-lg shadow-sm basis-0 dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
                    <Suspense fallback={<LoadingSpinner />}>
                        <ChatHistory
                            messages={messages}
                            streamingMessage={streamingMessage}
                            onLoadHistory={handleLoadHistory}
                            onSendMessage={handleSendMessage}
                        />
                    </Suspense>
                </div>
                <ChatInput ref={ref} onNewMessage={handleNewMessage} onStreamingMessage={setStreamingMessage} />
            </div>
        </main>
    );
}
