"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState<{ message: string, code?: string } | null>(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, displayName }),
            });

            const result = await res.json();

            if (!result.success) {
                setError({
                    message: result.error.message,
                    code: result.error.code
                });
            } else {
                setSuccess(true);
                setTimeout(() => router.push("/"), 1500);
            }
        } catch (err) {
            setError({ message: "An unexpected error occurred", code: "INTERNAL_ERROR" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="panel">
            <h1>Create Account</h1>

            {error && (
                <div className="error-box">
                    <p className="error-message">{error.message}</p>
                    {error.code && <span className="error-code">{error.code}</span>}
                </div>
            )}

            {success && <div className="success-box">Registration initiated. Redirecting to entry point...</div>}

            <form onSubmit={handleSubmit} className="form-group">
                <div className="input-container">
                    <label htmlFor="displayName">Display Name</label>
                    <input
                        id="displayName"
                        type="text"
                        placeholder="John Doe"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="name@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={isSubmitting ? "btn-loading" : ""}
                >
                    {isSubmitting ? "Initializing..." : "Initialize Mastery"}
                </button>
            </form>

            <div className="link-text">
                Already registered? <Link href="/login">Sign In</Link>
            </div>
        </div>
    );
}
