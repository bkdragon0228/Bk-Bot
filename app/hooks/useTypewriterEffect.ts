import { useState, useEffect } from "react";

interface TypewriterOptions {
    text: string;
    delay?: number;
    onComplete?: () => void;
    startTyping?: boolean;
}

export function useTypewriterEffect({ text, delay = 50, onComplete, startTyping = true }: TypewriterOptions) {
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (!startTyping) {
            setIsTyping(true);
            setDisplayText("");
            return;
        }

        let index = 0;
        setIsTyping(true);
        setDisplayText("");

        const interval = setInterval(() => {
            if (index <= text.length) {
                setDisplayText(text.slice(0, index));
                index++;
            } else {
                setIsTyping(false);
                clearInterval(interval);
                onComplete?.();
            }
        }, delay);

        return () => clearInterval(interval);
    }, [text, delay, onComplete, startTyping]);

    return { displayText, isTyping };
}
