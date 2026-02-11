"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ProblemView, MCQChoice } from "@/domain/problem";

export default function PlayPage({ params }: { params: Promise<{ worldSlug: string; domainSlug: string; archetypeSlug: string }> }) {
    const { worldSlug, domainSlug, archetypeSlug } = use(params);
    const [problem, setProblem] = useState<ProblemView | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

    async function fetchProblem() {
        setLoading(true);
        setError(null);
        setSelectedChoice(null);
        try {
            const res = await fetch(`/api/play/problem?archetypeSlug=${archetypeSlug}`);
            const result = await res.json();
            if (result.success) {
                setProblem(result.data);
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError("Failed to establish calibration link.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProblem();
    }, [archetypeSlug]);

    // Inject Katex for LaTeX rendering
    useEffect(() => {
        if (!document.getElementById('katex-css')) {
            const link = document.createElement('link');
            link.id = 'katex-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';
            document.head.appendChild(link);
        }

        if (!window.hasOwnProperty('renderMathInElement')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js';
            script.async = true;
            script.onload = () => {
                const autoRender = document.createElement('script');
                autoRender.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js';
                autoRender.onload = () => {
                    // @ts-ignore
                    window.renderMathInElement(document.body, {
                        delimiters: [
                            { left: '$$', right: '$$', display: true },
                            { left: '$', right: '$', display: false },
                            { left: '\\(', right: '\\)', display: false },
                            { left: '\\[', right: '\\]', display: true }
                        ]
                    });
                };
                document.head.appendChild(autoRender);
            };
            document.head.appendChild(script);
        } else {
            // Re-render if already exists
            // @ts-ignore
            if (window.renderMathInElement) {
                // @ts-ignore
                window.renderMathInElement(document.body);
            }
        }
    }, [problem]);

    const handleSubmit = async () => {
        if (!selectedChoice) return;
        alert(`Selected Choice: ${selectedChoice}. Submission logic pending calibration engine update.`);
    };

    if (loading) {
        return (
            <div className="home-container" style={{ textAlign: "center", justifyContent: "center", minHeight: "60vh" }}>
                <div className="rating-label">Isolating Variables</div>
                <h1>CALIBRATING PROBLEM...</h1>
            </div>
        );
    }

    if (error || !problem) {
        return (
            <div className="home-container" style={{ textAlign: "center", justifyContent: "center", minHeight: "60vh" }}>
                <div className="error-message">Calibration Failed</div>
                <h1>{error || "Signal Interrupted"}</h1>
                <button onClick={fetchProblem} className="btn-submit" style={{ marginTop: "24px" }}>
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="play-container">
            <header className="home-header">
                <div>
                    <Link href={`/world/${worldSlug}/${domainSlug}`} className="rating-label" style={{
                        textDecoration: "none",
                        transition: "color 150ms ease"
                    }}>
                        ← ABANDON SESSION
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                        <h1 style={{ margin: 0 }}>{problem.topic}</h1>
                        <div className="tier-label" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            YOUR STANDING: {problem.userRating ?? "---"}
                        </div>
                    </div>
                </div>
            </header>

            <div className="problem-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <div className="rating-label" style={{ fontSize: '12px', opacity: 0.6 }}>
                        CALIBRATION REQ: {problem.rating}
                    </div>
                </div>

                <div className="problem-prompt">
                    {problem.promptLatex}
                </div>

                <div className="choice-grid">
                    {problem.choices.map((choice) => (
                        <button
                            key={choice.id}
                            className={`choice-card ${selectedChoice === choice.id ? 'selected' : ''}`}
                            onClick={() => setSelectedChoice(choice.id)}
                        >
                            <span className="choice-id">{choice.id}</span>
                            <span className="choice-content">{choice.content}</span>
                        </button>
                    ))}
                </div>

                <div className="play-footer">
                    <button
                        onClick={handleSubmit}
                        className="btn-submit"
                        disabled={!selectedChoice}
                    >
                        Verify Calibration
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {problem.tags.map(tag => (
                    <span key={tag} className="rating-label" style={{ fontSize: '10px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '4px' }}>
                        #{tag.toUpperCase()}
                    </span>
                ))}
            </div>
        </div>
    );
}
