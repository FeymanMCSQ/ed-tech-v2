'use client';

import { useState, useEffect } from 'react';
import { Search, Database, Layers, BookOpen, ChevronRight, Loader2 } from 'lucide-react';

type Level = 'SUBJECT' | 'DOMAIN' | 'ARCHETYPE';

interface EnumerationItem {
    id: string;
    title: string;
    count: number;
}

export default function EnumerateProblemsPage() {
    const [level, setLevel] = useState<Level>('ARCHETYPE');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<EnumerationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/pipeline/enumerate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level, query }),
            });
            const data = await res.json();
            if (data.success) {
                setResults(data.data);
            } else {
                setError(data.error || 'Failed to fetch results');
            }
        } catch (err: any) {
            setError(err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    // Auto-search on level change or query change (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch();
        }, 300);
        return () => clearTimeout(timer);
    }, [level, query]);

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '100px',
            position: 'relative',
        }}>
            {/* Ambient Background */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'radial-gradient(circle at center, #1a2333 0%, var(--bg-primary) 70%)',
                zIndex: -1,
            }} />

            <div className="home-header" style={{ width: '100%', maxWidth: '1000px', marginBottom: 'var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <h1>Problem Enumeration</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Audit and inventory problem distribution across the knowledge graph.</p>
                </div>
                <div className="tier-label" style={{ color: 'var(--accent-math)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>Inventory Mode</div>
            </div>

            <main style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {/* Search Controls */}
                <div className="panel" style={{ padding: 'var(--space-8)', maxWidth: '100%', marginTop: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: 'var(--space-10)', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '320px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
                                Entity Level
                            </label>
                            <div style={{ display: 'flex', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border)' }}>
                                {(['SUBJECT', 'DOMAIN', 'ARCHETYPE'] as Level[]).map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLevel(l)}
                                        style={{
                                            flex: 1,
                                            padding: '10px 0',
                                            borderRadius: '8px',
                                            fontSize: '10px',
                                            fontWeight: 800,
                                            border: 'none',
                                            backgroundColor: level === l ? 'var(--accent)' : 'transparent',
                                            color: level === l ? 'white' : 'var(--text-muted)',
                                            transition: 'all 200ms var(--ease-out-quint)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
                                Keyword Search
                            </label>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={`Filter ${level.toLowerCase()}s by name or ID...`}
                                    style={{
                                        padding: '16px 16px 16px 52px',
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        width: '100%',
                                        fontSize: '16px',
                                        color: 'var(--text-primary)',
                                        transition: 'all 200ms ease',
                                    }}
                                />
                                <Search size={22} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                                {loading && (
                                    <Loader2 size={22} className="animate-spin" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent)' }} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', animation: 'fadeIn 0.6s var(--ease-out-quint)' }}>
                    {results.map((item) => (
                        <div key={item.id} className="panel result-card" style={{
                            padding: 'var(--space-4) var(--space-8)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 200ms var(--ease-out-quint)',
                            cursor: 'default',
                            maxWidth: '100%',
                            marginTop: 0
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    backgroundColor: 'var(--bg-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--border)'
                                }}>
                                    {level === 'SUBJECT' && <BookOpen size={20} style={{ color: 'var(--accent)' }} />}
                                    {level === 'DOMAIN' && <Layers size={20} style={{ color: 'var(--accent)' }} />}
                                    {level === 'ARCHETYPE' && <Database size={20} style={{ color: 'var(--accent)' }} />}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontWeight: 800, fontSize: '17px', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{item.title}</span>
                                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace', opacity: 0.7 }}>ID: {item.id}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '22px', fontWeight: 900, color: item.count > 0 ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: '1.1' }}>{item.count}</div>
                                    <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Inventory</div>
                                </div>
                                <ChevronRight size={18} style={{ opacity: 0.15 }} />
                            </div>
                        </div>
                    ))}

                    {!loading && results.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 'var(--space-12)', opacity: 0.5 }}>
                            <Search size={48} style={{ marginBottom: 'var(--space-4)', opacity: 0.2 }} />
                            <p>No matches found for this level and query.</p>
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .panel:hover {
                    transform: translateX(4px);
                    border-color: var(--accent) !important;
                }
            `}</style>
        </div>
    );
}
