"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Message } from "@/app/lib/types";
import { getVisitorId } from "@/app/lib/visitor";

interface ChatInputProps {
    onNewMessage: (message: Message) => void;
    onStreamingMessage: (message: string | undefined) => void;
}

export interface ChatInputHandle {
    sendMessage: (text: string) => Promise<void>;
}

const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(({ onNewMessage, onStreamingMessage }, ref) => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 메시지 전송 로직을 분리
    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;
        setIsLoading(true);

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text.trim(),
            timestamp: Date.now(),
        };
        onNewMessage(userMessage);

        let streamingContent = "";

        try {
            const visitorId = await getVisitorId();
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text.trim(), visitorId }),
            });

            if (!response.ok) throw new Error("Failed to send message");

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No reader available");

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    const finalMessage: Message = {
                        id: Date.now().toString(),
                        role: "assistant",
                        content: streamingContent,
                        timestamp: Date.now(),
                    };
                    onNewMessage(finalMessage);
                    onStreamingMessage(undefined);
                    break;
                }

                const text = new TextDecoder().decode(value);
                const lines = text.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.content) {
                                streamingContent += data.content;
                                onStreamingMessage(streamingContent);
                            }
                        } catch (e) {
                            console.error("Error parsing SSE data:", e);
                        }
                    }
                }
            }

            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            onStreamingMessage(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    // ref를 통해 노출할 메서드 정의
    useImperativeHandle(ref, () => ({
        sendMessage,
    }));

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await sendMessage(message);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="면접 질문을 입력하세요..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-3 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
                    aria-label={isLoading ? "전송 중" : "메시지 전송"}
                >
                    {isLoading ? (
                        <svg
                            className="w-5 h-5 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    )}
                </button>
            </div>
        </form>
    );
});

ChatInput.displayName = "ChatInput";

export default ChatInput;
