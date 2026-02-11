"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { DomainDetail, ArchetypeView } from "@/domain/world";

export default function DomainPage({ params }: { params: Promise<{ slug: string; domainSlug: string }> }) {
    const { slug, domainSlug } = use(params);
    const [domain, setDomain] = useState<DomainDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Accent logic from Design System
    const accentColor = slug === 'math' ? '#4F8CFF' : slug === 'physics' ? '#9C6BFF' : slug === 'comedy' ? '#FFB547' : '#3B82F6';

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

            <section style={{ width: '100%' }}>
                <div className="section-title" style={{
                    borderLeft: `4px solid ${accentColor}`,
                    paddingLeft: '16px',
                    fontSize: '14px',
                    letterSpacing: '1px',
                    marginBottom: 'var(--space-8)'
                }}>
                    AVAILABLE ARCHETYPES / COGNITIVE PATTERNS
                </div>
                <div className="world-grid">
                    {domain.archetypes.map(archetype => (
                        <ArchetypeCard
                            key={archetype.id}
                            archetype={archetype}
                            worldSlug={slug}
                            domainSlug={domainSlug}
                            accentColor={accentColor}
                        />
                    ))}
                </div>
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
    // Safety fallback for accent color
    const accentColor = propAccent || (worldSlug === 'math' ? '#4F8CFF' : worldSlug === 'physics' ? '#9C6BFF' : worldSlug === 'comedy' ? '#FFB547' : '#3B82F6');

    // Explicit number parsing for rating (Scale: 200-1900)
    const rating = Number(archetype.rating) || 200;

    // Calculate segments (1-5)
    // 200 should be 1 segment, 1900 should be 5 segments
    // Progress = (rating - 200) / 1700
    const progress = Math.max(0, Math.min(1, (rating - 200) / 1700));
    const masterSegs = Math.min(Math.max(Math.floor(progress * 5) + 1, 1), 5);

    return (
        <Link
            href={`/play/${worldSlug}/${domainSlug}/${archetype.slug}`}
            className="world-card enrolled"
            style={{
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'row',
                gap: '24px',
                alignItems: 'stretch',
                minHeight: '160px',
                transition: 'all 160ms var(--ease-out-quint)',
                position: 'relative',
                overflow: 'hidden'
            }}
            onClick={() => {
                const audio = new Audio('/sfx/card_1.mp3');
                audio.play().catch(e => console.error("Audio playback stalled", e));
            }}
        >
            {/* Left Column: Mastery Ladder */}
            <div style={{
                width: '16px',
                background: 'var(--bg-primary)',
                borderRadius: '8px',
                padding: '3px',
                display: 'flex',
                flexDirection: 'column-reverse',
                gap: '3px',
                border: '1px solid var(--border)',
                zIndex: 2
            }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{
                        flex: 1,
                        borderRadius: '4px',
                        background: i < masterSegs ? accentColor : 'transparent',
                        boxShadow: i < masterSegs ? `0 0 12px ${accentColor}88` : 'none',
                        opacity: i < masterSegs ? 1 : 0.05,
                        transition: 'all 0.4s ease'
                    }} />
                ))}
            </div>

            {/* Middle: Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2 }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h2 style={{ fontSize: '22px', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>{archetype.title}</h2>
                        <span className="tier-label" style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '4px 8px',
                            background: `${accentColor}15`,
                            color: accentColor,
                            border: `1px solid ${accentColor}33`,
                            borderRadius: '4px',
                            letterSpacing: '0.05em'
                        }}>{archetype.tier?.toUpperCase() || "NOVICE"}</span>
                    </div>
                    <p style={{
                        margin: '8px 0',
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.4,
                        opacity: 0.8
                    }}>
                        {archetype.summary || "Calibrate your precision in this cognitive pattern."}
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div className="rating-container">
                        <span className="rating-label">Inertia</span>
                        <span className="rating-value" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{rating}</span>
                    </div>
                    <div className="rating-container">
                        <span className="rating-label">Samples</span>
                        <span className="rating-value" style={{ opacity: 0.6 }}>{archetype.attemptCount}</span>
                    </div>
                </div>
            </div>

            {/* Right: Action */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                borderLeft: '1px solid var(--border)',
                paddingLeft: '24px',
                zIndex: 2
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '20px',
                    background: `${accentColor}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: accentColor,
                    fontSize: '20px',
                    fontWeight: 900,
                    transition: 'all 160ms ease'
                }} className="enter-arrow">
                    →
                </div>
            </div>

            <style jsx>{`
                .world-card:hover .enter-arrow {
                    background: ${accentColor};
                    color: white;
                    transform: scale(1.1) translateX(4px);
                    box-shadow: 0 0 20px ${accentColor}66;
                }
                .world-card:active {
                    transform: scale(0.98);
                }
                .world-card:hover {
                    border-color: ${accentColor}33;
                    background: linear-gradient(to bottom right, rgba(255,255,255,0.02), transparent);
                }
            `}</style>
        </Link>
    );
}
