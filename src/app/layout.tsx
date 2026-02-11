import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Archetype Learning Engine",
    description: "Granular skill calibration platform",
    icons: {
        icon: "/icons/icon-32.png",
        shortcut: "/icons/icon-32.png",
        apple: "/icons/icon-128.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" style={{ backgroundColor: "#0B0F14" }}>
            <body className={inter.className}>
                <Navbar />
                <main style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    {children}
                </main>
            </body>
        </html>
    );
}
