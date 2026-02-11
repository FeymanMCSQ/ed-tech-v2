"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { DomainDetail, ArchetypeView } from "@/domain/world";

export default function DomainPage({ params }: { params: Promise<{ slug: string; domainSlug: string }> }) {
    const { slug, domainSlug } = use(params);
    const [domain, setDomain] = useState<DomainDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                <div className="rating-label">Focusing Beam</div>
                <h1>CALIBRATING {domainSlug.toUpperCase()}</h1>
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
        <div className="home-container">
            <header className="home-header" style={{ marginBottom: "var(--space-12)" }}>
                <div>
                    <Link href={`/world/${slug}`} className="rating-label" style={{
                        textDecoration: "none",
                        transition: "color 150ms ease"
                    }}>
                        ← RETURN TO {slug.toUpperCase()}
                    </Link>
                    <h1 style={{
                        marginTop: "var(--space-4)",
                        color: "var(--text-primary)"
                    }}>{domain.title}</h1>
                    <p style={{ color: "var(--text-secondary)", maxWidth: "800px" }}>
                        {domain.summary || "Archetype calibration grounds active."}
                    </p>
                </div>
            </header>

            <section>
                <div className="section-title">Cognitive Patterns / Archetypes</div>
                <div className="world-grid">
                    {domain.archetypes.map(archetype => (
                        <ArchetypeCard
                            key={archetype.id}
                            archetype={archetype}
                            worldSlug={slug}
                            domainSlug={domainSlug}
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
    domainSlug
}: {
    archetype: ArchetypeView;
    worldSlug: string;
    domainSlug: string;
}) {
    const rating = archetype.rating || 0;
    const activeSteps = rating >= 2000 ? 5 : rating >= 1700 ? 4 : rating >= 1400 ? 3 : rating >= 800 ? 2 : rating > 0 ? 1 : 0;

    return (
        <Link
            href={`/play/${worldSlug}/${domainSlug}/${archetype.slug}`}
            className="world-card enrolled"
            data-domain={worldSlug === 'math' ? 'mathematics' : worldSlug}
        >
            <div className="world-content">
                <h2>{archetype.title}</h2>
                <p className="tagline">{archetype.summary || "Calibrate your precision in this cognitive pattern."}</p>

                <div className="enter-link">
                    Begin Calibration
                </div>
            </div>

            <div className="mastery-ladder">
                <div className="ladder-line"></div>
                {[5, 4, 3, 2, 1].map(step => (
                    <div
                        key={step}
                        className={`ladder-step ${step <= activeSteps ? "active" : ""}`}
                    />
                ))}
            </div>

            <div className="world-footer">
                <div className="rating-container">
                    <span className="rating-label">Local Rating</span>
                    <span className="rating-value">{archetype.rating || "200"}</span>
                </div>
                <span className="tier-label">{archetype.tier}</span>
            </div>
        </Link>
    );
}
