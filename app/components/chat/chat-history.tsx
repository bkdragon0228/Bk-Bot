"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/app/lib/types";
import MarkdownPreview from "@uiw/react-markdown-preview";

interface ChatHistoryProps {
    messages: Message[];
    streamingMessage?: string;
}

export default function ChatHistory({ messages, streamingMessage }: ChatHistoryProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingMessage]);

    return (
        <div className="space-y-4">
            {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                    >
                        {message.role === "user" ? (
                            message.content
                        ) : (
                            <MarkdownPreview
                                source={message.content}
                                className="!bg-transparent !text-gray-900"
                                style={{ background: "transparent" }}
                            />
                        )}
                    </div>
                </div>
            ))}
            {streamingMessage && (
                <div className="flex justify-start">
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
