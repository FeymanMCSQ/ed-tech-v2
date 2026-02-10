import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Archetype Learning Engine",
    description: "Granular skill calibration platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" style={{ backgroundColor: "#0B0F14" }}>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
