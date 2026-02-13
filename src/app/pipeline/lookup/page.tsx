"use client";

import { useState, useEffect } from "react";

type EntityType = "subject" | "domain" | "archetype" | "user";

interface LookupResult {
    id: string;
    title: string;
}

export default function PipelineLookupPage() {
    const [type, setType] = useState<EntityType>("subject");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<LookupResult[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setStatus('loading');
            try {
                const response = await fetch(`/api/pipeline/lookup?type=${type}&query=${encodeURIComponent(query)}`);
                const result = await response.json();

                if (result.success) {
                    setResults(result.data);
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (e) {
                setStatus('error');
            }
        };

        const debounceTimer = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounceTimer);
    }, [type, query]);

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopyFeedback(id);
        setTimeout(() => setCopyFeedback(null), 2000);
    };

    return (
        <main style={{
            padding: '80px var(--space-6) var(--space-12)',
            maxWidth: '1000px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)'
        }}>
            <header>
                <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
                    Pipeline Lookup
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Find IDs for subjects, domains, archetypes, and users.
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
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                            Lookup Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as EntityType)}
                            style={{
                                background: '#0a0e14',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                padding: 'var(--space-3) var(--space-4)',
                                color: 'white',
                                fontSize: '14px',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="subject">Subject</option>
                            <option value="domain">Domain</option>
                            <option value="archetype">Archetype</option>
                            <option value="user">User (Email)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                            Search Title / Email
                        </label>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={type === 'user' ? "Search for a user email..." : `Search for a ${type}...`}
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
            </section>

            <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {status === 'loading' && (
                    <p style={{ color: 'var(--accent-math)', fontSize: '14px', fontWeight: 600 }}>⚡ Searching...</p>
                )}

                {status === 'success' && results.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No matches found for "{query}"</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {results.map((item) => (
                        <div key={item.id} style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: 'var(--space-4) var(--space-5)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'border-color 150ms ease'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontSize: '15px', fontWeight: 700 }}>{item.title}</span>
                                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                                    {item.id}
                                </span>
                            </div>

                            <button
                                onClick={() => handleCopy(item.id)}
                                style={{
                                    background: copyFeedback === item.id ? 'var(--success)' : 'rgba(255,255,255,0.05)',
                                    color: copyFeedback === item.id ? 'white' : 'var(--text-secondary)',
                                    border: '1px solid',
                                    borderColor: copyFeedback === item.id ? 'var(--success)' : 'var(--border)',
                                    padding: 'var(--space-2) var(--space-4)',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.03em',
                                    transition: 'all 150ms ease'
                                }}
                            >
                                {copyFeedback === item.id ? 'Copied!' : 'Copy ID'}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
