"use client";

import { useState } from "react";

interface AnalyticsData {
    archetype: { id: string; title: string; slug: string };
    userRating: number;
    userAttemptCount: number;
    attempts: Array<{
        id: string;
        createdAt: string;
        correct: boolean;
        timeMs: number;
        deltaUser: number;
        deltaProblem: number;
        chosen: string | null;
        problem: { id: string; rating: number; topic: string };
    }>;
    ratingTrend: Array<{ attemptIndex: number; rating: number; createdAt: string }>;
}

export default function AnalyticsPage() {
    const [archetypeId, setArchetypeId] = useState("");
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState("");

    const handleAnalyze = async () => {
        if (!archetypeId.trim()) return;
        setStatus('loading');
        setErrorMsg("");
        setData(null);

        try {
            const res = await fetch(`/api/pipeline/analytics?archetypeId=${encodeURIComponent(archetypeId.trim())}`);
            const result = await res.json();

            if (result.success) {
                setData(result.data);
                setStatus('success');
            } else {
                setErrorMsg(result.error?.message || "Unknown error");
                setStatus('error');
            }
        } catch {
            setErrorMsg("Failed to connect to analytics endpoint");
            setStatus('error');
        }
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
                    Archetype Analytics
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Analyze attempt history and rating trends for a specific archetype.
                </p>
            </header>

            {/* Input Section */}
            <section style={{
                background: 'var(--surface)',
                padding: 'var(--space-6)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                display: 'flex',
                gap: 'var(--space-4)',
                alignItems: 'flex-end'
            }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                        Archetype ID
                    </label>
                    <input
                        type="text"
                        value={archetypeId}
                        onChange={(e) => setArchetypeId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        placeholder="Paste archetype ID here..."
                        style={{
                            background: '#0a0e14',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: 'var(--space-3) var(--space-4)',
                            color: 'white',
                            fontSize: '14px',
                            fontFamily: 'monospace',
                            outline: 'none'
                        }}
                    />
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={status === 'loading' || !archetypeId.trim()}
                    style={{
                        padding: 'var(--space-3) var(--space-8)',
                        fontSize: '14px',
                        fontWeight: 700,
                        borderRadius: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}
                >
                    {status === 'loading' ? 'Loading...' : 'Analyze'}
                </button>
            </section>

            {/* Error State */}
            {status === 'error' && (
                <div style={{
                    background: 'rgba(255, 93, 93, 0.1)',
                    border: '1px solid var(--error)',
                    borderRadius: '12px',
                    padding: 'var(--space-4) var(--space-6)',
                    color: 'var(--error)',
                    fontSize: '14px',
                    fontWeight: 600
                }}>
                    {errorMsg}
                </div>
            )}

            {/* Results */}
            {data && (
                <>
                    {/* Summary Section */}
                    <section style={{
                        background: 'var(--surface)',
                        padding: 'var(--space-6)',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        gap: 'var(--space-8)',
                        alignItems: 'center'
                    }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                Archetype
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                                {data.archetype.title}
                            </div>
                            <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '4px' }}>
                                {data.archetype.slug}
                            </div>
                        </div>
                        <StatBox label="Current Rating" value={data.userRating} />
                        <StatBox label="Total Attempts" value={data.userAttemptCount} />
                        <StatBox
                            label="Accuracy"
                            value={data.attempts.length > 0
                                ? `${Math.round((data.attempts.filter(a => a.correct).length / data.attempts.length) * 100)}%`
                                : '—'
                            }
                        />
                    </section>

                    {/* Rating Trend Chart */}
                    {data.ratingTrend.length > 1 && (
                        <section style={{
                            background: 'var(--surface)',
                            padding: 'var(--space-6)',
                            borderRadius: '16px',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                                Rating Trend
                            </div>
                            <RatingChart trend={data.ratingTrend} />
                        </section>
                    )}

                    {/* Attempts Table */}
                    <section style={{
                        background: 'var(--surface)',
                        padding: 'var(--space-6)',
                        borderRadius: '16px',
                        border: '1px solid var(--border)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                                Attempt History ({data.attempts.length})
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                                <span style={{ color: 'var(--success)' }}>{data.attempts.filter(a => a.correct).length}</span>
                                <span style={{ color: 'var(--text-muted)' }}> / {data.attempts.length}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 500, marginLeft: '6px' }}>correct</span>
                            </div>
                        </div>

                        {data.attempts.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No attempts recorded.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                            <Th>#</Th>
                                            <Th>Timestamp</Th>
                                            <Th>Topic</Th>
                                            <Th>P.Rating</Th>
                                            <Th>Result</Th>
                                            <Th>Δ Rating</Th>
                                            <Th>Time</Th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.attempts.map((a, i) => (
                                            <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                <Td mono>{i + 1}</Td>
                                                <Td mono>{formatDate(a.createdAt)}</Td>
                                                <Td>{a.problem.topic}</Td>
                                                <Td mono>{a.problem.rating}</Td>
                                                <Td>
                                                    <span style={{
                                                        color: a.correct ? 'var(--success)' : 'var(--error)',
                                                        fontWeight: 700,
                                                        fontSize: '12px'
                                                    }}>
                                                        {a.correct ? '✓ CORRECT' : '✗ WRONG'}
                                                    </span>
                                                </Td>
                                                <Td mono>
                                                    <span style={{
                                                        color: a.deltaUser > 0 ? 'var(--success)' : a.deltaUser < 0 ? 'var(--error)' : 'var(--text-muted)'
                                                    }}>
                                                        {a.deltaUser > 0 ? '+' : ''}{a.deltaUser}
                                                    </span>
                                                </Td>
                                                <Td mono>{(a.timeMs / 1000).toFixed(1)}s</Td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </>
            )}
        </main>
    );
}

/* ---------- Sub-components ---------- */

function StatBox({ label, value }: { label: string; value: string | number }) {
    return (
        <div style={{ textAlign: 'center', minWidth: '80px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {label}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                {value}
            </div>
        </div>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th style={{
            textAlign: 'left',
            padding: '8px 12px',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em'
        }}>
            {children}
        </th>
    );
}

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
    return (
        <td style={{
            padding: '10px 12px',
            color: 'var(--text-secondary)',
            fontFamily: mono ? 'monospace' : 'inherit',
            whiteSpace: 'nowrap'
        }}>
            {children}
        </td>
    );
}

function RatingChart({ trend }: { trend: Array<{ attemptIndex: number; rating: number; createdAt: string }> }) {
    const width = 800;
    const height = 200;
    const padX = 40;
    const padY = 20;

    const ratings = trend.map(t => t.rating);
    const minR = Math.min(...ratings) - 20;
    const maxR = Math.max(...ratings) + 20;
    const rangeR = maxR - minR || 1;

    const scaleX = (i: number): number => padX + (i / (trend.length - 1)) * (width - 2 * padX);
    const scaleY = (r: number): number => height - padY - ((r - minR) / rangeR) * (height - 2 * padY);

    const linePath = trend.map((t, i) =>
        `${i === 0 ? 'M' : 'L'} ${scaleX(i).toFixed(1)} ${scaleY(t.rating).toFixed(1)}`
    ).join(' ');

    // Grid lines
    const gridSteps = 4;
    const gridLines: number[] = [];
    for (let i = 0; i <= gridSteps; i++) {
        gridLines.push(minR + (rangeR / gridSteps) * i);
    }

    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', maxHeight: '250px' }}>
            {/* Grid */}
            {gridLines.map((r, i) => (
                <g key={i}>
                    <line
                        x1={padX} y1={scaleY(r)}
                        x2={width - padX} y2={scaleY(r)}
                        stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                    />
                    <text
                        x={padX - 6} y={scaleY(r) + 4}
                        fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="end"
                        fontFamily="monospace"
                    >
                        {Math.round(r)}
                    </text>
                </g>
            ))}

            {/* Line */}
            <path d={linePath} fill="none" stroke="var(--accent, #4F8CFF)" strokeWidth="2" strokeLinejoin="round" />

            {/* Dots */}
            {trend.map((t, i) => (
                <circle
                    key={i}
                    cx={scaleX(i)}
                    cy={scaleY(t.rating)}
                    r="3"
                    fill="var(--accent, #4F8CFF)"
                    opacity={0.8}
                >
                    <title>Attempt {t.attemptIndex}: {t.rating}</title>
                </circle>
            ))}
        </svg>
    );
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: '2-digit' })
        + ' ' + d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
}
