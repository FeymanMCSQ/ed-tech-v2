"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { DomainDetail, ArchetypeView } from "@/domain/world";
import { getDomainAccentColor } from "@/lib/colors";
import { Copy, Check, Lock, Unlock, CheckCircle } from "lucide-react";

// Helper to chunk the array
function chunk<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
        array.slice(i * size, i * size + size)
    );
}

export default function DomainPage({ params }: { params: Promise<{ slug: string; domainSlug: string }> }) {
    const { slug, domainSlug } = use(params);
    const [domain, setDomain] = useState<DomainDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const accentColor = domain ? getDomainAccentColor(domain.subjectOrder) : (slug === 'math' ? '#4F8CFF' : slug === 'physics' ? '#9C6BFF' : '#3B82F6');

    async function fetchDomainDetail() {
        try {
            const res = await fetch(`/api/worlds/${slug}/${domainSlug}`);
            const result = await res.json();
            if (result.success) {
                setDomain(result.data);
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError("Failed to calibrate domain connection.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDomainDetail();
    }, [slug, domainSlug]);

    if (loading) {
        return (
            <div className="home-container" style={{ textAlign: "center", justifyContent: "center", minHeight: "60vh" }}>
                <div className="rating-label" style={{ animation: 'pulse-opacity 1s infinite' }}>Focusing Beam</div>
                <h1 style={{ letterSpacing: '0.1em' }} >CALIBRATING {domainSlug.toUpperCase()}</h1>
            </div>
        );
    }

    if (error || !domain) {
        return (
            <div className="home-container" style={{ textAlign: "center", justifyContent: "center", minHeight: "60vh" }}>
                <div className="error-message">Domain Error</div>
                <h1>{error || "Unknown Instability"}</h1>
                <Link href={`/world/${slug}`} className="enter-link" style={{ justifyContent: "center", marginTop: "24px" }}>
                    Return to Realm
                </Link>
            </div>
        );
    }

    return (
        <div className="home-container" style={{ '--accent': accentColor } as React.CSSProperties}>
            <header className="home-header" style={{ marginBottom: "var(--space-8)", borderBottom: 'none' }}>
                <div style={{ width: '100%' }}>
                    <Link href={`/world/${slug}`} className="rating-label" style={{
                        textDecoration: "none",
                        opacity: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ fontSize: '18px' }}>←</span> RETURN TO {slug.toUpperCase()} REALM
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: "var(--space-6)" }}>
                        <div style={{ flex: 1 }}>
                            <h1 style={{
                                fontSize: '48px',
                                fontWeight: 900,
                                margin: 0,
                                color: "var(--text-primary)",
                                textShadow: `0 0 30px ${accentColor}22`
                            }}>{domain.title}</h1>
                            <p style={{
                                color: "var(--text-secondary)",
                                maxWidth: "700px",
                                fontSize: '18px',
                                marginTop: '12px',
                                lineHeight: 1.6
                            }}>
                                {domain.summary || "Archetype calibration grounds active. Select a cognitive pattern to begin mastery ascent."}
                            </p>
                        </div>
                        <div className="tier-label" style={{
                            padding: '12px 24px',
                            fontSize: '14px',
                            background: `${accentColor}11`,
                            borderColor: `${accentColor}33`,
                            color: accentColor,
                            letterSpacing: '0.2em'
                        }}>
                            COGNITIVE SCAN READY
                        </div>
                    </div>
                </div>
            </header>

            <LevelNavigator levels={chunk(domain.archetypes, 6)} accentColor={accentColor} />

            <section style={{ width: '100%' }}>
                {chunk(domain.archetypes, 6).map((levelArchetypes, index) => {
                    const levelNum = index + 1;
                    const attemptedCount = levelArchetypes.filter(a => a.attemptCount > 0).length;
                    const isComplete = attemptedCount === levelArchetypes.length;
                    const isBlank = attemptedCount === 0;

                    const statusLabel = isComplete ? "COMPLETED" : isBlank ? "LOCKED" : "ONGOING";
                    const statusColor = isComplete ? "var(--success)" : isBlank ? "var(--text-muted)" : accentColor;
                    const statusIcon = isComplete ? <CheckCircle size={14} /> : isBlank ? <Lock size={14} /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${accentColor}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />;

                    return (
                        <div id={`level-${levelNum}`} key={levelNum} className="level-section" style={{ marginBottom: '48px', opacity: isBlank ? 0.8 : 1, transition: 'opacity 0.3s ease', scrollMarginTop: '100px' }}>
                            <div className="level-header" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: `1px solid rgba(255,255,255,0.05)`,
                                paddingBottom: '12px',
                                marginBottom: '24px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <h2 style={{
                                        fontSize: '18px',
                                        fontWeight: 800,
                                        margin: 0,
                                        color: isBlank ? 'var(--text-muted)' : 'var(--text-primary)',
                                        letterSpacing: '0.05em'
                                    }}>
                                        LEVEL {levelNum}
                                    </h2>
                                    <div style={{
                                        fontSize: '10px',
                                        fontWeight: 800,
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: isComplete ? 'rgba(16, 185, 129, 0.1)' : isBlank ? 'rgba(255,255,255,0.05)' : `${accentColor}22`,
                                        color: statusColor,
                                        border: `1px solid ${statusColor}44`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        {statusIcon}
                                        {statusLabel}
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '12px',
                                    color: 'var(--text-secondary)',
                                    fontFamily: 'monospace',
                                    opacity: 0.7
                                }}>
                                    {attemptedCount} / {levelArchetypes.length} PROTOCOLS
                                </span>
                            </div>

                            <div className="world-grid">
                                {levelArchetypes.map(archetype => (
                                    <ArchetypeCard
                                        key={archetype.id}
                                        archetype={archetype}
                                        worldSlug={slug}
                                        domainSlug={domainSlug}
                                        accentColor={accentColor}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}

function ArchetypeCard({
    archetype,
    worldSlug,
    domainSlug,
    accentColor: propAccent
}: {
    archetype: ArchetypeView;
    worldSlug: string;
    domainSlug: string;
    accentColor: string;
}) {
    // Standardize accent color across all components
    const accent = propAccent || (worldSlug === 'math' ? '#4F8CFF' : worldSlug === 'physics' ? '#9C6BFF' : worldSlug === 'comedy' ? '#FFB547' : '#3B82F6');

    // Explicit rating parsing
    const rating = Math.round(Number(archetype.rating) || 200);

    // Explicit Mastery Staircase (Range: 200-1900)
    let mastery = 1;
    if (rating >= 1560) mastery = 5;
    else if (rating >= 1220) mastery = 4;
    else if (rating >= 880) mastery = 3;
    else if (rating >= 540) mastery = 2;

    return (
        <Link
            href={`/play/${worldSlug}/${domainSlug}/${archetype.slug}`}
            className="world-card enrolled"
            style={{
                padding: 'var(--space-6)',
                display: 'flex',
                gap: '20px',
                alignItems: 'stretch',
                minHeight: '170px',
                transition: 'all 200ms ease-out',
                position: 'relative',
                textDecoration: 'none',
                backgroundColor: 'rgba(28, 36, 48, 0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                color: 'inherit',
                '--accent': accent
            } as any}
            onClick={() => {
                const audio = new Audio('/sfx/card_1.mp3');
                audio.play().catch(e => console.error("Audio playback stalled", e));
            }}
        >
            {/* 1. Mastery Column */}
            <div style={{
                width: '12px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '6px',
                padding: '3px',
                display: 'flex',
                flexDirection: 'column-reverse',
                gap: '4px',
                border: '1px solid rgba(255,255,255,0.05)',
                flexShrink: 0
            }}>
                {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} style={{
                        flex: 1,
                        borderRadius: '3px',
                        backgroundColor: step <= mastery ? accent : 'transparent',
                        boxShadow: step <= mastery ? `0 0 10px ${accent}` : 'none',
                        opacity: step <= mastery ? 1 : 0.05,
                        transition: 'all 0.4s ease'
                    }} />
                ))}
            </div>

            {/* 2. Content Column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                <div style={{ pointerEvents: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <h2 style={{ fontSize: '22px', margin: 0, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                            {archetype.title}
                        </h2>
                        <span style={{
                            fontSize: '9px',
                            fontWeight: 800,
                            padding: '4px 8px',
                            background: 'rgba(255,255,255,0.05)',
                            color: accent,
                            border: `1px solid ${accent}33`,
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            flexShrink: 0
                        }}>
                            {archetype.tier || "NOVICE"}
                        </span>
                    </div>
                    <p style={{
                        margin: '12px 0',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {archetype.summary || "Calibrate your precision in this cognitive pattern."}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div className="rating-container">
                        <div className="rating-label" style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.5 }}>Inertia</div>
                        <div className="rating-value" style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF' }}>{rating}</div>
                    </div>
                    <div className="rating-container">
                        <div className="rating-label" style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.5 }}>Samples</div>
                        <div className="rating-value" style={{ fontSize: '18px', fontWeight: 600, opacity: 0.4, color: '#FFFFFF' }}>{archetype.attemptCount}</div>
                    </div>
                </div>
            </div>

            {/* 3. Copy Interaction Group (Vertically Stacked) */}
            <CopyButton
                text={archetype.id}
                title="Copy Archetype ID"
                topOffset={12}
                rightOffset={12}
                activeColor="#60a5fa"
            />
            <CopyButton
                text={`${archetype.title}: ${archetype.summary || "Calibrate your precision in this cognitive pattern."}`}
                title="Copy Archetype Details"
                topOffset={48}
                rightOffset={12}
            />

            {/* 4. Action Column */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '20px',
                borderLeft: '1px solid rgba(255,255,255,0.05)',
                flexShrink: 0
            }}>
                <div className="enter-btn-circle" style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '22px',
                    backgroundColor: `${accent}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 200ms ease',
                    color: accent,
                    border: `1px solid ${accent}44`
                }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 200ms ease' }}>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </div>

            <style jsx>{`
                .world-card:hover {
                    background: rgba(255,255,255,0.035) !important;
                    border-color: rgba(255,255,255,0.2) !important;
                }
                .world-card:hover .enter-btn-circle {
                    background-color: ${accent} !important;
                    color: #FFFFFF !important;
                    transform: scale(1.1);
                    box-shadow: 0 0 20px ${accent}88;
                }
                .world-card:hover svg {
                    transform: translateX(2px);
                }
                .world-card:active {
                    transform: scale(0.97) !important;
                }
            `}</style>
        </Link>
    );
}

function CopyButton({
    text,
    title,
    topOffset = 12,
    rightOffset = 12,
    activeColor = '#10b981'
}: {
    text: string;
    title: string;
    topOffset?: number;
    rightOffset?: number;
    activeColor?: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            style={{
                position: 'absolute',
                top: `${topOffset}px`,
                right: `${rightOffset}px`,
                zIndex: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                color: copied ? activeColor : 'rgba(255,255,255,0.4)',
                opacity: copied ? 1 : 0.6
            }}
            className="copy-btn"
            title={title}
        >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <style jsx>{`
                .copy-btn:hover {
                    background: rgba(255,255,255,0.08);
                    color: white;
                    opacity: 1;
                }
            `}</style>
        </button>
    );
}

function LevelNavigator({ levels, accentColor }: { levels: ArchetypeView[][], accentColor: string }) {
    // Find the first level that is NOT complete (or the last one if all are complete)
    // "Complete" means all archetypes have > 0 attempts.
    let currentLevelIndex = levels.findIndex(level => level.some(a => a.attemptCount === 0));
    if (currentLevelIndex === -1 && levels.length > 0) currentLevelIndex = levels.length - 1;
    if (currentLevelIndex === -1) currentLevelIndex = 0;

    const completedLevelsCount = levels.filter(level => level.every(a => a.attemptCount > 0)).length;

    return (
        <div className="level-nav" style={{
            position: 'sticky',
            top: '20px',
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '12px 24px',
            marginBottom: '48px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            width: 'fit-content',
            maxWidth: '100%',
            margin: '0 auto 48px auto' // Centered
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, opacity: 0.5, letterSpacing: '0.1em' }}>CURRENT LEVEL</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)' }}>{currentLevelIndex + 1} <span style={{ opacity: 0.3, fontSize: '14px' }}>/ {levels.length}</span></div>
            </div>

            <div style={{ height: '32px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1, minWidth: 0, justifyContent: 'center' }}>
                {levels.map((level, idx) => {
                    const isComplete = level.every(a => a.attemptCount > 0);
                    const isCurrent = idx === currentLevelIndex;
                    const isLocked = !isComplete && !isCurrent && idx > currentLevelIndex;

                    return (
                        <button
                            key={idx}
                            onClick={() => {
                                document.getElementById(`level-${idx + 1}`)?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="nav-segment"
                            style={{
                                width: '36px',
                                height: '8px',
                                borderRadius: '4px',
                                background: isComplete ? 'var(--success)' : isCurrent ? accentColor : 'rgba(255,255,255,0.1)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                opacity: isLocked ? 0.3 : 1,
                                position: 'relative',
                                boxShadow: isCurrent ? `0 0 10px ${accentColor}66` : 'none',
                                transform: isCurrent ? 'scaleY(1.5)' : 'none'
                            }}
                            title={`Level ${idx + 1}: ${isComplete ? 'Completed' : isCurrent ? 'Current' : 'Locked'}`}
                        />
                    );
                })}
            </div>

            <style jsx>{`
                .nav-segment:hover {
                    opacity: 1 !important;
                    transform: scaleY(1.5) !important;
                }
            `}</style>
        </div>
    );
}
