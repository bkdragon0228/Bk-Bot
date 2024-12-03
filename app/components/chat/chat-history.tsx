"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Message } from "@/app/lib/types";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Image from "next/image";
import ME from "@/public/image/me.jpeg";
import { getVisitorId } from "@/app/lib/visitor";
import { useTypewriterEffect } from "@/app/hooks/useTypewriterEffect";

interface ChatHistoryProps {
    messages: Message[];
    streamingMessage?: string;
    onLoadHistory: (messages: Message[]) => void;
    onSendMessage: (message: string) => void;
}

/** init: 처음 방문한 경우에만, loading: 처리 중, loaded: 처리 완료, error: 처리 실패 */
type ChatHistoryState = "init" | "loading" | "loaded" | "error";

export default function ChatHistory({ messages, streamingMessage, onLoadHistory, onSendMessage }: ChatHistoryProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState<string>("");

    const [checkVisitor, setCheckVisitor] = useState<boolean>(false);
    const [checkChat, setCheckChat] = useState<boolean>(false);

    const [state, setState] = useState<ChatHistoryState | null>(null);
    const isLoaded = state === "loaded";
    const isLoading = state === "loading";

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingMessage]);

    const renderMessage = (content: string) => (
        <MarkdownPreview
            source={content}
            className="!bg-transparent !text-gray-900 dark:!text-gray-100 [&_pre]:!bg-gray-100 dark:[&_pre]:!bg-gray-800 [&_code]:!text-gray-800 dark:[&_code]:!text-gray-200 [&_p]:text-sm"
            style={{ background: "transparent" }}
        />
    );

    const handleLoadHistory = async () => {
        setState("loading");
        try {
            const visitorId = await getVisitorId();
            const response = await fetch(`/api/chat/history?visitorId=${visitorId}`);
            if (!response.ok) throw new Error("Failed to fetch history");

            const data = await response.json();
            onLoadHistory(data.chats);
        } catch (error) {
            console.error("Error loading history:", error);
        } finally {
            setState("loaded");
        }
    };

    const handleCreateVisitor = async (name: string) => {
        const visitorId = await getVisitorId();
        const response = await fetch(`/api/visitor`, {
            method: "POST",
            body: JSON.stringify({ visitorId, name }),
        });

        if (response.ok) {
            setState("loaded");
            setCheckVisitor(true);
        }
    };

    const handleCheckVisitor = useCallback(async () => {
        setState("loading");
        try {
            const visitorId = await getVisitorId();
            const response = await fetch(`/api/visitor/check?visitorId=${visitorId}`);
            const data = await response.json();
            setCheckVisitor(data.exists);
            setName(data.name);

            if (!data.exists) {
                setState("init");
                setCheckChat(false);
            } else {
                setState("loaded");
                handleCheckChat();
            }
        } catch (error) {
            console.error("Error checking visitor existence:", error);
        }
    }, []);

    const handleCheckChat = async () => {
        setState("loading");
        try {
            const visitorId = await getVisitorId();
            const response = await fetch(`/api/chat/check?visitorId=${visitorId}`);
            const data = await response.json();
            setCheckChat(data.exists);
        } catch (error) {
            console.error("Error checking chat records:", error);
        } finally {
            setState("loaded");
        }
    };

    const firstMessage = useTypewriterEffect({
        text: name
            ? `안녕하세요! ${name}에 지원한 프론트엔드 개발자 김범규입니다. 잘부탁드립니다.`
            : `안녕하세요! 프론트엔드 개발자 김범규입니다. 잘부탁드립니다.`,
        delay: 50,
        startTyping: checkVisitor && isLoaded && !checkChat,
    });

    useEffect(() => {
        handleCheckVisitor();
    }, [handleCheckVisitor]);

    return (
        <div className="relative">
            {state === null && <>초기화 중입니다.</>}
            {/* 처음 방문한 경우 */}
            {state === "init" && !checkVisitor && (
                <div className="fixed top-0 left-0 flex flex-col items-center justify-center w-screen h-screen gap-2 bg-transparent">
                    <div className="w-[500px] h-[500px] bg-white rounded-lg dark:bg-gray-800 flex flex-col border border-gray-200 dark:border-gray-700">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                처음 방문하셨군요! 회사명을 입력해주세요!
                            </h2>
                        </div>

                        <div className="flex-1 p-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="회사명을 입력해주세요."
                                className="w-full p-2 text-sm text-gray-900 bg-gray-100 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                            />
                            <div className="flex flex-col gap-1 mt-4">
                                <span className="block text-sm text-gray-500 text-pretty dark:text-gray-400">
                                    입력하신 내용을 대화에 포함시킵니다.
                                </span>
                                <span className="text-sm text-gray-500 text-pretty dark:text-gray-400">
                                    원치 않으시면 건너뛰기를 눌러주세요.
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row-reverse gap-2 p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => name && handleCreateVisitor(name)}
                                className="w-full p-2 text-sm text-gray-900 bg-gray-100 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                            >
                                시작하기
                            </button>
                            <button
                                onClick={() => handleCreateVisitor("")}
                                className="w-full p-2 text-sm text-gray-900 bg-gray-100 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                            >
                                건너뛰기
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* 이전에 방문한 경우 + 채팅 기록이 있을 때 */}
            {messages.length === 0 && isLoaded && checkVisitor && checkChat && (
                <div className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        또 오셨군요? 이전 대화를 불러올 수 있어요!
                    </span>
                    <button
                        onClick={handleLoadHistory}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm text-gray-700 transition-colors bg-gray-100 rounded-lg shadow dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
                    >
                        {isLoading ? "불러오는 중..." : "이전 대화 불러오기"}
                    </button>
                </div>
            )}

            {/* 이전에 방문한 경우 + 채팅 기록이 없을 떄*/}
            {checkVisitor && isLoaded && !checkChat && (
                <div className="flex flex-col justify-center gap-2">
                    <span className="self-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                        김범규님이 면접에 참여하였습니다. 지금 면접을 시작해보세요!
                    </span>
                    <div className="flex flex-col items-start gap-2 sm:flex-row">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                                <Image src={ME} alt="AI" width={32} height={32} className="object-cover rounded-full" />
                            </div>
                        </div>
                        <div className="flex max-w-[85%] sm:max-w-[80%] justify-start ml-6 sm:ml-0">
                            <div className="p-3 text-sm text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-100">
                                {renderMessage(firstMessage?.displayText || "")}
                            </div>
                        </div>
                    </div>

                    {messages.length === 0 && !firstMessage.isTyping && (
                        <div className={`flex justify-end items-start gap-3 flex-row`}>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => onSendMessage("자기소개 부탁드립니다.")}
                                    className="px-4 py-2 text-left text-gray-900 transition-colors bg-gray-200 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                >
                                    자기소개 부탁드립니다.
                                </button>
                                <button
                                    onClick={() => onSendMessage("최근 프로젝트에 대해 설명해주세요.")}
                                    className="px-4 py-2 text-left text-gray-900 transition-colors bg-gray-200 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                >
                                    최근 프로젝트에 대해 설명해주세요.
                                </button>
                                <button
                                    onClick={() => onSendMessage("가장 자신 있는 기술 스택은 무엇인가요?")}
                                    className="px-4 py-2 text-left text-gray-900 transition-colors bg-gray-200 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                >
                                    가장 자신 있는 기술 스택은 무엇인가요?
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="mt-16 space-y-6">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex flex-col sm:flex-row ${
                            message.role === "user" ? "items-end sm:items-start" : "items-start"
                        } gap-3 ${message.role === "user" ? "sm:flex-row-reverse" : "sm:flex-row"}`}
                    >
                        <div className="flex-shrink-0">
                            {message.role === "user" ? (
                                <div className="flex items-center justify-center w-8 h-8 text-sm text-white bg-blue-500 rounded-full">
                                    {name.charAt(0) || "U"}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                                    <Image
                                        src={ME}
                                        alt="AI"
                                        width={32}
                                        height={32}
                                        className="object-cover rounded-full"
                                    />
                                </div>
                            )}
                        </div>
                        <div
                            className={`flex max-w-[85%] sm:max-w-[80%] justify-start ${
                                message.role === "user" ? "mr-6 sm:mr-0" : "ml-6 sm:ml-0"
                            }`}
                        >
                            <div className="p-3 text-sm text-gray-900 bg-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-100">
                                {renderMessage(message.content)}
                                <div className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
                                    {new Date(message.timestamp).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {streamingMessage && (
                    <div className="flex flex-col items-start gap-3 sm:items-start sm:flex-row">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                                <Image src={ME} alt="AI" width={32} height={32} className="object-cover rounded-full" />
                            </div>
                        </div>
                        <div className="max-w-[85%] sm:max-w-[80%] ml-6 sm:ml-0 rounded-lg p-3 bg-gray-200 dark:bg-gray-900">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                <MarkdownPreview
                                    source={streamingMessage}
                                    className="!bg-transparent !text-gray-900 dark:!text-gray-100 [&_pre]:!bg-gray-100 dark:[&_pre]:!bg-gray-800 [&_code]:!text-gray-800 dark:[&_code]:!text-gray-200 [&_p]:text-sm"
                                    style={{ background: "transparent" }}
                                />
                                <span className="animate-pulse">▊</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
