import React from "react";

import { getApiUrl } from "../../lib/util";
import ChatContainer from "./chat-container";
import { cookies } from "next/headers";

/**
 * @author
 * @function ChatServerContainer
 **/

export default async function ChatServerContainer(props) {
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

    return <ChatContainer initialVisitorData={visitorData} />;
}
