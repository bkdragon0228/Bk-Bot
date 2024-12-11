"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Message } from "@/app/lib/types";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Image from "next/image";
import ME from "@/public/image/me.jpeg";
import { useTypewriterEffect } from "@/app/hooks/useTypewriterEffect";

interface ChatHistoryProps {
    messages: Message[];
    streamingMessage?: string;
    onLoadHistory: (messages: Message[]) => void;
    onSendMessage: (message: string) => void;
}

/** init: 처음 방문한 경우에만, loading: 처리 중, loaded: 처리 완료, error: 처리 실패 */
type ChatHistoryState = "init" | "loading" | "loaded" | "error";

function ProfilePopover() {
    return (
        <div className="relative group">
            <div className="flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700 hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600">
                <Image src={ME} alt="AI" width={32} height={32} className="object-cover w-full h-full rounded-full" />
            </div>

            <div className="absolute top-[90%] left-0 w-full h-3" />

            <div className="absolute z-10 invisible p-4 mt-2 transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:visible w-80 dark:bg-gray-800 dark:border-gray-700 group-hover:opacity-100 [&:hover]:visible [&:hover]:opacity-100">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-full">
                        <Image src={ME} alt="Profile" width={64} height={64} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">김범규</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Frontend Developer</p>
                        <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600 dark:text-gray-300">안녕하세요.</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">프론트엔드 개발자 김범규입니다.</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <a
                                    href="https://github.com/bkdragon0228"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    GitHub
                                </a>
                                <span>•</span>
                                <a
                                    href="https://bkdragon0228.tistory.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    Blog
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ChatHistory({ messages, streamingMessage, onLoadHistory, onSendMessage }: ChatHistoryProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState<string>("");

    const [checkVisitor, setCheckVisitor] = useState<boolean>(false);
    const [checkChat, setCheckChat] = useState<boolean>(false);

    const [state, setState] = useState<ChatHistoryState | null>(null);
    const isLoaded = state === "loaded";
    const isLoading = state === "loading";
    const [errorMessage, setErrorMessage] = useState<string>("");

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
            const response = await fetch(`/api/chat/history`);
            if (!response.ok) {
                const error = await response.json();
                setErrorMessage(error.error);
                setState("error");
                return;
            }

            const data = await response.json();
            onLoadHistory(data.chats);
            setState("loaded");
        } catch (error) {
            console.error("Error loading history:", error);
            setErrorMessage("채팅 기록을 불러오는데 실패했습니다.");
            setState("error");
        }
    };

    const handleCreateVisitor = async (name: string) => {
        setState("loading");
        try {
            const response = await fetch(`/api/visitor`, {
                method: "POST",
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                const error = await response.json();
                setErrorMessage(error.error);
                setState("error");
                return;
            }

            setState("loaded");
            setCheckVisitor(true);
        } catch (error) {
            console.error("Error creating visitor:", error);
            setErrorMessage("방문자 생성에 실패했습니다.");
            setState("error");
        }
    };

    const handleCheckVisitor = useCallback(async () => {
        setState("loading");
        try {
            const response = await fetch(`/api/visitor/check`);
            if (!response.ok) {
                const error = await response.json();
                setErrorMessage(error.error);
                setState("error");
                return;
            }

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
            setErrorMessage("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            setState("error");
        }
    }, []);

    const handleCheckChat = async () => {
        setState("loading");
        try {
            const response = await fetch(`/api/chat/check`);
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
            : `안녕하세요! 프론트엔드 개발자 김범규입니다. 잘부탁드립니���.`,
        delay: 50,
        startTyping: checkVisitor && isLoaded && !checkChat,
    });

    useEffect(() => {
        handleCheckVisitor();
    }, [handleCheckVisitor]);

    return (
        <div className="relative">
            {state === null && <>초기화 중입니다.</>}
            {state === "error" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                            오류가 발생했습니다
                        </h3>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{errorMessage}</p>
                        <button
                            onClick={() => {
                                setErrorMessage("");
                                handleCheckVisitor();
                            }}
                            className="w-full px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            )}
            {/* 처음 방문한 경우 */}
            {state === "init" && !checkVisitor && (
                <div className="fixed top-0 left-0 flex flex-col items-center justify-center w-screen h-screen gap-2 bg-transparent">
                    <div className="w-[500px] h-[500px] bg-white rounded-lg dark:bg-gray-800 flex flex-col border border-gray-200 dark:border-gray-700">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                안녕하세요! 회사명을 입력해주세요!
                            </h2>
                        </div>

                        <div className="flex-1 p-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="회사명을 입력해주세요."
                                className="w-full p-2 text-sm text-gray-900 bg-gray-100 border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleCreateVisitor(name);
                                    }
                                }}
                            />
                            <div className="flex flex-col gap-1 mt-4">
                                <span className="block text-sm text-gray-500 text-pretty dark:text-gray-400">
                                    회사명을 입력해주시면 제가 귀사에 대해 더 잘 이해할 수 있어요.
                                </span>
                                <span className="text-sm text-gray-500 text-pretty dark:text-gray-400">
                                    원하지 않으시다면 건너뛰고 진행할 수 있습니다.
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
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleLoadHistory}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm text-gray-700 transition-colors bg-gray-100 rounded-lg shadow dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
                        >
                            {isLoading ? "불러오는 중..." : "이전 대화 불러오기"}
                        </button>
                        <button
                            onClick={() => {
                                setState("loaded");
                                setCheckChat(false);
                            }}
                            className="px-4 py-2 text-sm text-gray-700 transition-colors bg-gray-100 rounded-lg shadow dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"
                        >
                            새로운 대화 시작하기
                        </button>
                    </div>
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
                                <ProfilePopover />
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
                            <ProfilePopover />
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
