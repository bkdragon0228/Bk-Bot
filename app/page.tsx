"use client";

import { useState } from "react";
import { Suspense } from "react";
import ChatHistory from "./components/chat/chat-history";
import ChatInput from "./components/chat/chat-input";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { Message } from "./lib/types";

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [streamingMessage, setStreamingMessage] = useState<string>();

    const handleNewMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
    };

    const handleLoadHistory = (historicalMessages: Message[]) => {
        setMessages(historicalMessages);
    };

    return (
        <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
            {/* 채팅 섹션 */}
            <div className="w-full md:w-1/2 p-4 flex flex-col h-screen mx-auto">
                <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                    <Suspense fallback={<LoadingSpinner />}>
                        <ChatHistory
                            messages={messages}
                            streamingMessage={streamingMessage}
                            onLoadHistory={handleLoadHistory}
                        />
                    </Suspense>
                </div>
                <ChatInput onNewMessage={handleNewMessage} onStreamingMessage={setStreamingMessage} />
            </div>
        </main>
    );
}
