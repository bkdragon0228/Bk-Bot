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
            <head>
                {/* 초기 테마 설정을 위한 인라인 스크립트 추가 */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            try {
                                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                                    document.documentElement.classList.add('dark')
                                } else {
                                    document.documentElement.classList.remove('dark')
                                }
                            } catch (_) {}
                        `,
                    }}
                />
            </head>
            <body
                className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col w-screen h-screen`}
            >
                <ThemeProvider>
                    {/* <VisitorTracker /> */}
                    <AppHeader />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
