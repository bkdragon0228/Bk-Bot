"use client";

import { useTheme } from "@/app/context/theme-context";
import { useState, useEffect } from "react";

export default function AppHeader() {
    const [mounted, setMounted] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white transition-colors">
                <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-900">면접 시뮬레이터</h1>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">면접 시뮬레이터</h1>
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    {theme === "light" ? "라이트" : "다크"}
                </button>
            </div>
        </header>
    );
}
