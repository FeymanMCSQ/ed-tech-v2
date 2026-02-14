'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { BAND_DESCRIPTIONS } from '@/generator/bandDescriptions';

type StatusStage = 'idle' | 'anticipation' | 'processing' | 'success' | 'error';

interface ApiResponse {
    success: boolean;
    insertedCount?: number;
    usage?: {
        total_tokens: number;
    };
    error?: string;
    stage?: string;
    issues?: any[];
}

export default function GenerateProblemsPage() {
    const [archetypeId, setArchetypeId] = useState('');
    const [band, setBand] = useState('400_600');
    const [count, setCount] = useState(5);
    const [type, setType] = useState('MCQ');

    const [status, setStatus] = useState<StatusStage>('idle');
    const [response, setResponse] = useState<ApiResponse | null>(null);

    const bands = Object.keys(BAND_DESCRIPTIONS);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!archetypeId || status !== 'idle') return;

        setStatus('anticipation');
        setResponse(null);

        setTimeout(async () => {
            setStatus('processing');
            try {
                const res = await fetch('/api/pipeline/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ archetypeId, band, count, type }),
                });

                const data = await res.json();

                setTimeout(() => {
                    if (res.ok) {
                        setResponse(data);
                        setStatus('success');
                    } else {
                        setResponse(data);
                        setStatus('error');
                    }
                }, 300);
            } catch (err: any) {
                setResponse({ success: false, error: err.message || 'Network error', stage: 'client' });
                setStatus('error');
            }
        }, 180); // Design System Suspense Delay
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '120px',
            position: 'relative',
        }}>
            {/* Ambient Background Glow */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'radial-gradient(circle at center, #1a2333 0%, var(--bg-primary) 70%)',
                zIndex: -1,
            }} />

            <div className="home-header" style={{ width: '100%', maxWidth: '600px', marginBottom: 'var(--space-8)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <h1>Synthesize Problems</h1>
                    <p>Precision engineering for cognitive seed harvesting.</p>
                </div>
                <div className="tier-label" style={{ color: 'var(--accent-math)' }}>Pipeline Active</div>
            </div>

            <main className="panel" style={{
                maxWidth: '500px',
                marginTop: '0',
                transition: 'all 0.3s var(--ease-out-quint)',
                transform: status === 'idle' ? 'none' : 'scale(0.98)',
                opacity: status === 'processing' ? 0.8 : 1,
            }}>
                <form onSubmit={handleSubmit} className="form-group" style={{ margin: 0 }}>
                    {/* Archetype ID */}
                    <div className="input-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>Target Archetype</label>
                            <Link href="/pipeline/lookup" style={{ fontSize: '11px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                                Lookup IDs →
                            </Link>
                        </div>
                        <input
                            type="text"
                            value={archetypeId}
                            onChange={(e) => setArchetypeId(e.target.value)}
                            placeholder="cmj8gb7xq00..."
                            style={{
                                fontFamily: 'monospace',
                                transition: 'all 0.2s ease',
                                transform: 'translateY(0)',
                            }}
                            onFocus={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onBlur={(e) => e.target.style.transform = 'translateY(0)'}
                            required
                        />
                    </div>

                    {/* Band & Type */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div className="input-container">
                            <label>Cognitive Band</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={band}
                                    onChange={(e) => setBand(e.target.value)}
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        padding: '12px 14px',
                                        color: 'var(--text-primary)',
                                        fontSize: '14px',
                                        appearance: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {bands.map((b) => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div className="input-container">
                            <label>Structure Type</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        padding: '12px 14px',
                                        color: 'var(--text-primary)',
                                        fontSize: '14px',
                                        appearance: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <option value="MCQ">MCQ</option>
                                    <option value="NUMERIC">Numeric</option>
                                    <option value="EXPRESSION">Expression</option>
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, pointerEvents: 'none' }} />
                            </div>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="input-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>Harvest Quantity</label>
                            <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 800 }}>{count} items</span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={20}
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            style={{
                                padding: '4px 0',
                                border: 'none',
                                background: 'transparent',
                                accentColor: 'var(--accent)',
                                cursor: 'pointer',
                            }}
                        />
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={status !== 'idle' || !archetypeId}
                        className={status === 'anticipation' ? 'btn-loading' : ''}
                        style={{
                            width: '100%',
                            marginTop: 'var(--space-4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--space-2)',
                            background: status === 'processing' ? 'var(--bg-secondary)' : 'var(--accent)',
                            color: status === 'processing' ? 'var(--text-muted)' : 'white',
                            border: status === 'processing' ? '1px solid var(--border)' : 'none',
                        }}
                    >
                        {status === 'idle' && <Sparkles size={16} />}
                        {status === 'processing' && <Loader2 size={16} className="animate-spin" />}
                        {status === 'idle' ? 'Initiate Synthesis' : status === 'anticipation' ? 'Priming Neural Harvest...' : 'Synthesis Active...'}
                    </button>
                </form>

                {/* Status Feedback */}
                {status !== 'idle' && status !== 'anticipation' && (
                    <div style={{
                        marginTop: 'var(--space-8)',
                        paddingTop: 'var(--space-6)',
                        borderTop: '1px solid var(--border)',
                        animation: 'fadeIn 0.4s ease-out',
                    }}>
                        {status === 'processing' && (
                            <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    Constructing cognitive seeds from high-dimensional vectors...
                                </div>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="success-box" style={{ margin: 0, padding: 'var(--space-6)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'rgba(61, 220, 151, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid var(--success)'
                                    }}>
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 800, fontSize: '16px' }}>Synthesis Successful</span>
                                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{response?.insertedCount} seeds stored in archive</span>
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Energy Consumption:</span>
                                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{response?.usage?.total_tokens.toLocaleString()} tokens</span>
                                </div>
                                <button
                                    onClick={() => setStatus('idle')}
                                    style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '10px', fontSize: '12px' }}
                                >
                                    New Cycle
                                </button>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="error-box" style={{ margin: 0, padding: 'var(--space-6)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'rgba(255, 93, 93, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid var(--error)'
                                    }}>
                                        <AlertCircle size={24} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 800, fontSize: '16px' }}>Cycle Interrupted</span>
                                        <span className="error-code">Stage: {response?.stage || 'Unknown'}</span>
                                    </div>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--error)', opacity: 0.9, fontStyle: 'italic', margin: 0 }}>
                                    "{response?.error || 'A fatal anomaly was detected during harvest.'}"
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '10px', fontSize: '12px' }}
                                >
                                    Reset Protocol
                                </button>
                            </div>
                        )}
                    </div>
                )}
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
            `}</style>
        </div>
    );
}
