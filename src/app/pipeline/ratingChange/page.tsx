"use client";

import { useState } from "react";
import Link from "next/link";

export default function RatingChangePage() {
    const [userId, setUserId] = useState("");
    const [archetypeId, setArchetypeId] = useState("");
    const [rating, setRating] = useState(200);
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string, details?: any }>({ type: 'idle', message: "" });

    const handleUpdate = async () => {
        if (!userId.trim() || !archetypeId.trim()) {
            setStatus({ type: 'error', message: "User ID and Archetype ID are required" });
            return;
        }

        setStatus({ type: 'loading', message: "Updating user rating..." });

        try {
            const response = await fetch("/api/pipeline/rating-change", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId.trim(),
                    archetypeId: archetypeId.trim(),
                    rating: Number(rating)
                }),
            });

            const result = await response.json();

            if (result.success) {
                setStatus({
                    type: 'success',
                    message: `Successfully updated rating to ${result.data.rating}!`
                });
            } else {
                setStatus({
                    type: 'error',
                    message: result.error.message,
                    details: result.error.details
                });
            }
        } catch (e: any) {
            setStatus({ type: 'error', message: "Connection error: " + e.message });
        }
    };

    return (
        <main style={{
            padding: '80px var(--space-6) var(--space-12)',
            maxWidth: '800px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)'
        }}>
            <header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                            Rating Manual Override
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Adjust a user's archetype rating and log an audit event.
                        </p>
                    </div>
                    <Link href="/pipeline/lookup" style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--accent-math)',
                        textDecoration: 'none',
                        border: '1px solid var(--accent-math)',
                        padding: 'var(--space-2) var(--space-4)',
                        borderRadius: '8px'
                    }}>
                        Lookup Tool ↗
                    </Link>
                </div>
            </header>

            <section style={{
                background: 'var(--surface)',
                padding: 'var(--space-6)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-6)'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                            User ID
                        </label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="e.g. user_123..."
                            style={{
                                background: '#0a0e14',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                padding: 'var(--space-3) var(--space-4)',
                                color: 'white',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                            Archetype ID
                        </label>
                        <input
                            type="text"
                            value={archetypeId}
                            onChange={(e) => setArchetypeId(e.target.value)}
                            placeholder="e.g. arch_123..."
                            style={{
                                background: '#0a0e14',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                padding: 'var(--space-3) var(--space-4)',
                                color: 'white',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                        Target Rating (200 - 3000)
                    </label>
                    <input
                        type="number"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        min={200}
                        max={3000}
                        style={{
                            background: '#0a0e14',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: 'var(--space-3) var(--space-4)',
                            color: 'white',
                            fontSize: '14px',
                            outline: 'none',
                            width: '200px'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleUpdate}
                        disabled={status.type === 'loading'}
                        style={{
                            background: 'var(--accent-math)',
                            color: 'white',
                            padding: 'var(--space-3) var(--space-8)',
                            borderRadius: '12px',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            opacity: status.type === 'loading' ? 0.6 : 1
                        }}
                    >
                        {status.type === 'loading' ? 'Updating...' : 'Update Rating'}
                    </button>
                </div>
            </section>

            {status.type !== 'idle' && (
                <section style={{
                    padding: 'var(--space-4)',
                    borderRadius: '12px',
                    background: status.type === 'success'
                        ? 'rgba(61, 220, 151, 0.1)'
                        : status.type === 'loading'
                            ? 'rgba(79, 140, 255, 0.1)'
                            : 'rgba(255, 93, 93, 0.1)',
                    border: `1px solid ${status.type === 'success'
                            ? 'var(--success)'
                            : status.type === 'loading'
                                ? 'var(--accent-math)'
                                : 'var(--error)'
                        }`,
                    color: status.type === 'success'
                        ? 'var(--success)'
                        : status.type === 'loading'
                            ? 'var(--accent-math)'
                            : 'var(--error)',
                    animation: 'fadeIn 200ms ease-out'
                }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {status.type === 'success'
                            ? '✓ Update Successful'
                            : status.type === 'loading'
                                ? '⚡ Processing'
                                : '⚠ Update Blocked'}
                    </h3>
                    <p style={{ fontSize: '13px', fontWeight: 500 }}>{status.message}</p>
                    {status.details && (
                        <div style={{ marginTop: 'var(--space-4)' }}>
                            <p style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px' }}>Technical Details</p>
                            <pre style={{
                                fontSize: '11px',
                                background: 'rgba(0,0,0,0.2)',
                                padding: 'var(--space-4)',
                                borderRadius: '8px',
                                overflowX: 'auto'
                            }}>
                                {JSON.stringify(status.details, null, 2)}
                            </pre>
                        </div>
                    )}
                </section>
            )}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </main>
    );
}
