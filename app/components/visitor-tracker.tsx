"use client";

import { useEffect } from "react";
import { getVisitorId } from "../lib/visitor";

export function VisitorTracker() {
    useEffect(() => {
        const trackVisitor = async () => {
            const visitorId = await getVisitorId();
            try {
                await fetch("/api/visitor", {
                    method: "POST",
                    body: JSON.stringify({ visitorId }),
                });
            } catch (error) {
                console.error("Failed to track visitor:", error);
            }
        };

        trackVisitor();
    }, []);

    return null;
}
