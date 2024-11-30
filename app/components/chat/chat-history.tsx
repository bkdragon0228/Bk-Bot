"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "@/app/lib/types";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Image from "next/image";
import ME from "@/public/image/me.jpeg";

interface ChatHistoryProps {
    messages: Message[];
    streamingMessage?: string;
    onLoadHistory: (messages: Message[]) => void;
}

export default function ChatHistory({ messages, streamingMessage, onLoadHistory }: ChatHistoryProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingMessage]);

    const renderMessage = (content: string) => (
        <MarkdownPreview
            source={content}
            className="!bg-transparent !text-gray-900 dark:!text-gray-100 [&_pre]:!bg-gray-100 dark:[&_pre]:!bg-gray-800 [&_code]:!text-gray-800 dark:[&_code]:!text-gray-200"
            style={{ background: "transparent" }}
        />
    );

    const handleLoadHistory = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/chat/history");
            if (!response.ok) throw new Error("Failed to fetch history");

            const data = await response.json();
            onLoadHistory(data.chats);
        } catch (error) {
            console.error("Error loading history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            {messages.length === 0 && (
                <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <button
                        onClick={handleLoadHistory}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "불러오는 중..." : "이전 대화 불러오기"}
                    </button>
                </div>
            )}
            <div className="space-y-6 mt-16">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-start gap-3 ${
                            message.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                    >
                        <div className="flex-shrink-0">
                            {message.role === "user" ? (
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    U
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                    <Image
                                        src={ME}
                                        alt="AI"
                                        width={32}
                                        height={32}
                                        className="rounded-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex max-w-[80%] justify-start">
                            <div className="rounded-lg p-3 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                                {renderMessage(message.content)}
                            </div>
                        </div>
                    </div>
                ))}
                {streamingMessage && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                <Image src={ME} alt="AI" width={32} height={32} className="rounded-full object-cover" />
                            </div>
                        </div>
                        <div className="max-w-[80%] rounded-lg p-3 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                            <MarkdownPreview
                                source={streamingMessage}
                                className="!bg-transparent !text-gray-900 dark:!text-gray-100 [&_pre]:!bg-gray-100 dark:[&_pre]:!bg-gray-800 [&_code]:!text-gray-800 dark:[&_code]:!text-gray-200"
                                style={{ background: "transparent" }}
                            />
                            <span className="animate-pulse">▊</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
