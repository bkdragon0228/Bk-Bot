import { getApiUrl } from "./lib/util";
import ChatContainer from "./components/chat/chat-container";
import { cookies } from "next/headers";

export default async function Home() {
    let visitorData = {
        exists: false,
        name: "",
        hasChat: false,
    };

    const response = await fetch(`${getApiUrl()}/api/visitor/check`, {
        credentials: "include",
        cache: "no-store",
        headers: {
            Cookie: cookies().toString(),
        },
    });
    const visitor = await response.json();

    if (visitor.exists) {
        const chatResponse = await fetch(`${getApiUrl()}/api/chat/check`, {
            credentials: "include",
            cache: "no-store",
            headers: {
                Cookie: cookies().toString(),
            },
        });
        const chat = await chatResponse.json();

        visitorData = {
            exists: true,
            name: visitor.name || "",
            hasChat: chat.exists,
        };
    }

    return (
        <main className="flex flex-col flex-1 w-screen h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col flex-1 p-4 mx-auto md:w-1/2">
                <div className="flex flex-col flex-1 p-4 overflow-hidden rounded-lg shadow-sm ">
                    <ChatContainer initialVisitorData={visitorData} />
                </div>
            </div>
        </main>
    );
}
