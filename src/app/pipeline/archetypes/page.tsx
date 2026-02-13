"use client";

import { useState } from "react";
import { ArchetypeIngestionSchema } from "@/domain/pipeline";

export default function ArchetypePipelinePage() {
    const [domainId, setDomainId] = useState("");
    const [jsonInput, setJsonInput] = useState("");
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string, details?: any }>({ type: 'idle', message: "" });

    const handleSeed = async () => {
        if (!domainId.trim()) {
            setStatus({ type: 'error', message: "Domain ID is required" });
            return;
        }

        if (!jsonInput.trim()) {
            setStatus({ type: 'error', message: "Please enter some JSON data" });
            return;
        }

        setStatus({ type: 'loading', message: "Validating and seeding..." });

        try {
            const parsed = JSON.parse(jsonInput);

            // Client side validation check
            const validation = ArchetypeIngestionSchema.safeParse(parsed);
            if (!validation.success) {
                setStatus({
                    type: 'error',
                    message: "Validation failed locally",
                    details: validation.error.format()
                });
                return;
            }

            const response = await fetch("/api/pipeline/archetypes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    domainId: domainId.trim(),
                    archetypes: parsed
                }),
            });

            const result = await response.json();

            if (result.success) {
                setStatus({
                    type: 'success',
                    message: `Successfully seeded ${result.data.count} archetypes!`
                });
            } else {
                setStatus({
                    type: 'error',
                    message: result.error.message,
                    details: result.error.details
                });
            }
        } catch (e: any) {
            setStatus({ type: 'error', message: "Invalid JSON format: " + e.message });
        }
    };

    return (
        <main style={{
            padding: '80px var(--space-6) var(--space-12)',
            maxWidth: '900px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)'
        }}>
            <header>
                <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                    Archetype Pipeline
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Bulk seed archetypes under a specific domain.
                </p>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                        Target Domain ID
                    </label>
                    <input
                        type="text"
                        value={domainId}
                        onChange={(e) => setDomainId(e.target.value)}
                        placeholder="e.g. dom_1234567890"
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
                    <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                        Archetypes JSON Array
                    </label>
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder={`[\n  {\n    "slug": "basic-addition",\n    "title": "Basic Addition",\n    "stream": "VC",\n    "order": 1,\n    "summary": "Introduction to adding single digit numbers",\n    "eloMax": 800,\n    "eloMin": 200\n  }\n]`}
                        style={{
                            width: '100%',
                            height: '300px',
                            background: '#0a0e14',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: 'var(--space-4)',
                            color: '#4F8CFF',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            resize: 'vertical',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-4)' }}>
                    <button
                        onClick={() => {
                            setJsonInput("");
                            setDomainId("");
                            setStatus({ type: 'idle', message: "" });
                        }}
                        style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            padding: 'var(--space-2) var(--space-4)',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleSeed}
                        disabled={status.type === 'loading'}
                        style={{
                            background: 'var(--accent-math)',
                            color: 'white',
                            padding: 'var(--space-3) var(--space-8)',
                            borderRadius: '12px',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'transform 100ms ease, opacity 100ms ease',
                            opacity: status.type === 'loading' ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {status.type === 'loading' ? 'Processing...' : 'Seed Archetypes'}
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
                    <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {status.type === 'success'
                            ? '✓ Seeding Successful'
                            : status.type === 'loading'
                                ? '⚡ Processing'
                                : '⚠ Ingestion Blocked'}
                    </h3>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>{status.message}</p>

                    {status.details && (
                        <div style={{ marginTop: 'var(--space-4)' }}>
                            <p style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.6, marginBottom: '4px' }}>Technical Details</p>
                            <pre style={{
                                fontSize: '12px',
                                background: 'rgba(0,0,0,0.3)',
                                padding: 'var(--space-4)',
                                borderRadius: '8px',
                                overflowX: 'auto',
                                border: '1px solid rgba(255,255,255,0.05)'
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
