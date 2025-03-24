import ChatServerContainer from "./components/chat/chat-server-container";
import { Suspense } from "react";
import { ChatSkeleton } from "./components/ui/chat-skeleton";

export default async function Home() {
    return (
        <main className="flex flex-col flex-1 w-screen h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col flex-1 p-4 mx-auto md:w-1/2">
                <div className="flex flex-col flex-1 p-4 overflow-hidden rounded-lg shadow-sm bg-white dark:bg-gray-800">
                    <Suspense fallback={<ChatSkeleton />}>
                        <ChatServerContainer />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
