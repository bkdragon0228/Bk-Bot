"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/app/lib/types";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Image from "next/image";
import ME from "@/public/image/me.jpeg";

interface ChatHistoryProps {
    messages: Message[];
    streamingMessage?: string;
}

export default function ChatHistory({ messages, streamingMessage }: ChatHistoryProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingMessage]);

    const renderMessage = (content: string, isUser: boolean) =>
        isUser ? (
            content
        ) : (
            <MarkdownPreview
                source={content}
                className="!bg-transparent !text-gray-900"
                style={{ background: "transparent" }}
            />
        );

    return (
        <div className="space-y-6">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                    <div className="flex-shrink-0">
                        {message.role === "user" ? (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                U
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                <Image src={ME} alt="AI" width={32} height={32} className="rounded-full object-cover" />
                            </div>
                        )}
                    </div>
                    <div className={`flex max-w-[80%] ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`rounded-lg p-3 ${
                                message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                        >
                            {renderMessage(message.content, message.role === "user")}
                        </div>
                    </div>
                </div>
            ))}
            {streamingMessage && (
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Image src="/avatar.png" alt="AI" width={32} height={32} className="rounded-full" />
                        </div>
                    </div>
                    <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-900">
                        <MarkdownPreview
                            source={streamingMessage}
                            className="!bg-transparent !text-gray-900"
                            style={{ background: "transparent" }}
                        />
                        <span className="animate-pulse">▊</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}
