"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    displayName: string | null;
}

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me");
                const result = await res.json();
                if (result.success) {
                    setUser(result.data);
                }
            } catch (err) {
                console.error("Failed to fetch user session", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            const res = await fetch("/api/auth/signout", { method: "POST" });
            const result = await res.json();
            if (result.success) {
                setUser(null);
                router.push("/login");
            }
        } catch (err) {
            console.error("Sign out failed", err);
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link href="/" className="brand">
                    <img
                        src="/icons/icon-512.png"
                        alt="Feynman"
                        style={{ height: '32px', width: 'auto', display: 'block' }}
                    />
                </Link>

                <div className="nav-controls">
                    {!loading && (
                        user ? (
                            <div className="user-info">
                                <span className="user-name">{user.displayName || user.email}</span>
                                <button
                                    onClick={handleSignOut}
                                    className={`btn-signout ${isSigningOut ? "btn-loading" : ""}`}
                                    disabled={isSigningOut}
                                >
                                    {isSigningOut ? "Signing out..." : "Sign Out"}
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="btn-login">
                                Sign In
                            </Link>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
}
