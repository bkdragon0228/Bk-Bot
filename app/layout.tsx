import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/providers/theme-provider";
import AppHeader from "./components/app-header";
import { VisitorTracker } from "./components/visitor-tracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "면접 시뮬레이터",
    description: "AI 기반 면접 시뮬레이터",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body
                className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col w-screen h-screen`}
            >
                <ThemeProvider>
                    <VisitorTracker />
                    <AppHeader />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
