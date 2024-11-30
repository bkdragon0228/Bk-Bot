export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
}

export interface ChatResponse {
    message: string;
    error?: string;
}
