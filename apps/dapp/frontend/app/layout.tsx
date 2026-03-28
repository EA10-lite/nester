import type { Metadata } from "next";
import { Space_Grotesk, Inter, Cormorant } from "next/font/google";
import { PortfolioProvider } from "@/components/portfolio-provider";
import { WalletProvider } from "@/components/wallet-provider";
import { NotificationsProvider } from "@/components/notifications-provider";
import { ToastProvider } from "@/components/toast-provider";
import { ToastViewport } from "@/components/toast-viewport";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const cormorant = Cormorant({
    subsets: ["latin"],
    weight: ["300", "400"],
    style: ["normal", "italic"],
    variable: "--font-cormorant",
});

export const metadata: Metadata = {
    title: "Nester | DApp",
    description:
        "Decentralized savings and instant fiat settlements powered by Stellar.",
    icons: {
        icon: "/logo.png",
        apple: "/logo.png",
    },
};

import { SettingsProvider } from "@/context/settings-context";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className={`${spaceGrotesk.variable} ${inter.variable} ${cormorant.variable} antialiased`}
            >
                <SettingsProvider>
                    <WalletProvider>
                        <ToastProvider>
                            <NotificationsProvider>
                                <PortfolioProvider>
                                    {children}
                                    <ToastViewport />
                                </PortfolioProvider>
                            </NotificationsProvider>
                        </ToastProvider>
                    </WalletProvider>
                </SettingsProvider>
            </body>
        </html>
    );
}
