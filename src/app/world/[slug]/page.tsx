"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorldDetail, DomainView } from "@/domain/world";
import { getDomainAccentColor } from "@/lib/colors";
import { Copy, Check } from "lucide-react";
export default function WorldPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [world, setWorld] = useState<WorldDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enrollingId, setEnrollingId] = useState<string | null>(null);

    async function fetchWorldDetail() {
        try {
            const res = await fetch(`/api/worlds/${slug}`);
            const result = await res.json();
            if (result.success) {
                setWorld(result.data);
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError("Failed to calibrate realm connection.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchWorldDetail();
    }, [slug]);

    const handleEnroll = async (domainId: string, domainSlug: string) => {
        setEnrollingId(domainId);
        try {
            const res = await fetch("/api/worlds/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domainId }),
            });
            const result = await res.json();
            if (result.success) {
                // Success - redirect to the archetypes page for this domain
                router.push(`/world/${slug}/${domainSlug}`);
            } else {
                alert(result.error.message);
            }
        } catch (err) {
            alert("Enrollment synchronization failed.");
        } finally {
            setEnrollingId(null);
        }
    };

    if (loading) {
        return (
            <div className="home-container" style={{ textAlign: "center", justifyContent: "center", minHeight: "60vh" }}>
                <div className="rating-label">Aligning Scope</div>
                <h1>CALIBRATING {slug.toUpperCase()}</h1>
            </div>
        );
    }

    if (error || !world) {
        return (
            <div className="home-container" style={{ textAlign: "center", justifyContent: "center", minHeight: "60vh" }}>
                <div className="error-message">Realm Error</div>
                <h1>{error || "Unknown Instability"}</h1>
                <Link href="/" className="enter-link" style={{ justifyContent: "center", marginTop: "24px" }}>
                    Return to Core
                </Link>
            </div>
        );
    }

    const accentColor = world ? getDomainAccentColor(world.order) : (slug === 'math' ? '#4F8CFF' : '#3B82F6');

    return (
        <div className="home-container" style={{ '--accent': accentColor } as any}>
            <header className="home-header" style={{ marginBottom: "var(--space-12)" }}>
                <div>
                    <Link href="/" className="rating-label" style={{
                        textDecoration: "none",
                        transition: "color 150ms ease"
                    }}>
                        ← RETURN TO DASHBOARD
                    </Link>
                    <h1 style={{
                        marginTop: "var(--space-4)",
                        color: "var(--text-primary)"
                    }}>{world.title}</h1>
                    <p style={{ color: "var(--text-secondary)", maxWidth: "800px" }}>
                        {world.summary || "Deep calibration protocols active."}
                    </p>
                </div>
            </header>

            <section>
                <div className="section-title">Calibration Scope / Domains</div>
                <div className="world-grid">
                    {world.domains.map(domain => (
                        <DomainCard
                            key={domain.id}
                            domain={domain}
                            worldSlug={slug}
                            accentColor={accentColor}
                            isEnrolling={enrollingId === domain.id}
                            onEnroll={() => handleEnroll(domain.id, domain.slug)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

function DomainCard({
    domain,
    worldSlug,
    accentColor,
    isEnrolling,
    onEnroll
}: {
    domain: DomainView;
    worldSlug: string;
    accentColor: string;
    isEnrolling: boolean;
    onEnroll: () => void;
}) {
    const rating = domain.rating || 0;
    const activeSteps = rating >= 2000 ? 5 : rating >= 1700 ? 4 : rating >= 1400 ? 3 : rating >= 800 ? 2 : rating > 0 ? 1 : 0;

    return (
        <div
            className={`world-card ${domain.isEnrolled ? "enrolled" : ""}`}
            style={{
                '--accent': accentColor,
                position: 'relative' // Needed for absolute positioning of the copy buttons
            } as any}
            data-domain={worldSlug === 'math' ? 'mathematics' : worldSlug}
        >
            {/* 3. Copy Interaction Group */}
            <CopyButton
                text={domain.id}
                title="Copy Domain ID"
                topOffset={12}
                rightOffset={12}
                activeColor="#60a5fa"
            />
            <CopyButton
                text={`${domain.title}: ${domain.summary || "Explore the fundamental archetypes of this sector."}`}
                title="Copy Domain Details"
                topOffset={48}
                rightOffset={12}
            />
            <div className="world-content">
                <h2>{domain.title}</h2>
                <p className="tagline">{domain.summary || "Explore the fundamental archetypes of this sector."}</p>

                {domain.isEnrolled ? (
                    <Link
                        href={`/world/${worldSlug}/${domain.slug}`}
                        className="enter-link"
                        onClick={() => {
                            const audio = new Audio('/sfx/card_1.mp3');
                            audio.play().catch(e => console.error("Audio playback stalled", e));
                        }}
                    >
                        Resume Calibration
                    </Link>
                ) : (
                    <button
                        onClick={() => {
                            const audio = new Audio('/sfx/card_1.mp3');
                            audio.play().catch(e => console.error("Audio playback stalled", e));
                            onEnroll();
                        }}
                        className={`enter-link ${isEnrolling ? 'btn-loading' : ''}`}
                        disabled={isEnrolling}
                        style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                    >
                        {isEnrolling ? "Initializing..." : "Initialize Domain"}
                    </button>
                )}
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
                    <span className="rating-value">{domain.rating || "---"}</span>
                </div>
                {domain.isEnrolled && <span className="tier-label">ACTIVE</span>}
            </div>
        </div>
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
