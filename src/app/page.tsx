"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { World } from "@/domain/world";

export default function HomePage() {
    const [enrolled, setEnrolled] = useState<World[]>([]);
    const [available, setAvailable] = useState<World[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWorlds() {
            try {
                const res = await fetch("/api/worlds");
                const result = await res.json();
                if (result.success) {
                    setEnrolled(result.data.enrolled);
                    setAvailable(result.data.available);
                }
            } catch (err) {
                console.error("Failed to fetch worlds", err);
            } finally {
                setLoading(false);
            }
        }
        fetchWorlds();
    }, []);

    if (loading) {
        return (
            <div className="home-container" style={{ textAlign: "center", justifyContent: "center", minHeight: "60vh" }}>
                <div className="rating-label">Initializing Cognition</div>
                <h1>CALIBRATING REALMS</h1>
            </div>
        );
    }

    return (
        <div className="home-container">
            <header className="home-header">
                <div>
                    <div className="rating-label">CORE ENGINE</div>
                    <h1>ARCHETYPE</h1>
                    <p>Strategic path to absolute cognitive precision.</p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div className="rating-label">Global Standing</div>
                    <div className="rating-value" style={{ fontSize: "32px", color: "var(--accent)" }}>600</div>
                </div>
            </header>

            {enrolled.length > 0 && (
                <section>
                    <h2 className="section-title">Enrolled Pathways</h2>
                    <div className="world-grid">
                        {enrolled.map(world => (
                            <WorldCard key={world.id} world={world} />
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h2 className="section-title">Available Realms</h2>
                <div className="world-grid">
                    {available.length > 0 ? (
                        available.map(world => (
                            <WorldCard key={world.id} world={world} />
                        ))
                    ) : (
                        <div className="link-text" style={{ gridColumn: "1/-1", textAlign: "left", padding: "1rem" }}>
                            No realms found in the database.
                            <Link href="/login" style={{ marginLeft: "8px" }}>Sign in</Link> or initialize worlds.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function WorldCard({ world }: { world: World }) {
    // Determine active steps for the ladder based on rating
    const rating = world.rating || 0;
    const activeSteps = rating >= 2000 ? 5 : rating >= 1700 ? 4 : rating >= 1400 ? 3 : rating >= 800 ? 2 : rating > 0 ? 1 : 0;

    return (
        <Link href={`/world/${world.slug}`} className={`world-card ${world.isEnrolled ? "enrolled" : ""}`} data-domain={world.slug}>
            <div className="world-content">
                <h2>{world.title}</h2>
                <p className="tagline">{world.summary || "Explore the fundamental abstractions of this realm."}</p>

                <div className="enter-link">
                    {world.isEnrolled ? "Resume Calibration" : "Initialize Entry"}
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
                    <span className="rating-value">{world.rating || "---"}</span>
                </div>
                {world.tier && <span className="tier-label">{world.tier}</span>}
            </div>
        </Link>
    );
}
