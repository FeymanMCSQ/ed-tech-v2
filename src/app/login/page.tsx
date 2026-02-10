"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<{ message: string, code?: string } | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await res.json();

            if (!result.success) {
                setError({
                    message: result.error.message,
                    code: result.error.code
                });
            } else {
                setSuccess(true);
                // Redirect after success
                setTimeout(() => router.push("/"), 1500);
            }
        } catch (err) {
            setError({ message: "An unexpected error occurred", code: "INTERNAL_ERROR" });
        }
    };

    return (
        <div className="panel">
            <h1>Sign In</h1>

            {error && (
                <div className="error-box">
                    <p className="error-message">{error.message}</p>
                    {error.code && <span className="error-code">{error.code}</span>}
                </div>
            )}

            {success && <div className="success-box">Authentication successful. Access granted.</div>}

            <form onSubmit={handleSubmit} className="form-group">
                <div className="input-container">
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="name@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="password">Security Key</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Begin Session</button>
            </form>

            <div className="link-text">
                New candidate? <Link href="/register">Create Account</Link>
            </div>
        </div>
    );
}
