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
    const [prefetchedAnswer, setPrefetchedAnswer] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startTime, setStartTime] = useState<number>(0);

    async function fetchProblem() {
        setLoading(true);
        setError(null);
        setSelectedChoice(null);
        setPrefetchedAnswer(null);
        setIsVerified(false);
        setIsSubmitting(false);
        try {
            const res = await fetch(`/api/play/problem?archetypeSlug=${archetypeSlug}`);
            const result = await res.json();
            if (result.success) {
                setProblem(result.data);
                setStartTime(Date.now());
                // Prefetch answer
                fetchAnswer(result.data.id);
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError("Failed to establish calibration link.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchAnswer(problemId: string) {
        try {
            const res = await fetch(`/api/play/validate-prefetch?problemId=${problemId}`);
            const result = await res.json();
            if (result.success) {
                setPrefetchedAnswer(result.data.correctChoice);
            }
        } catch (err) {
            console.error("Prefetch failed", err);
        }
    }

    useEffect(() => {
        fetchProblem();
    }, [archetypeSlug]);

    // Katex rendering logic...
    useEffect(() => {
        if (!document.getElementById('katex-css')) {
            const link = document.createElement('link');
            link.id = 'katex-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';
            document.head.appendChild(link);
        }

        const renderMath = () => {
            // @ts-ignore
            if (window.renderMathInElement) {
                // @ts-ignore
                window.renderMathInElement(document.body, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false },
                        { left: '\\(', right: '\\)', display: false },
                        { left: '\\[', right: '\\]', display: true }
                    ]
                });
            }
        };

        if (!window.hasOwnProperty('renderMathInElement')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js';
            script.async = true;
            script.onload = () => {
                const autoRender = document.createElement('script');
                autoRender.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js';
                autoRender.onload = renderMath;
                document.head.appendChild(autoRender);
            };
            document.head.appendChild(script);
        } else {
            renderMath();
        }
    }, [problem, isVerified]);

    const handleSubmit = async () => {
        if (!selectedChoice || !problem || isVerified) return;

        setIsVerified(true);
        setIsSubmitting(true);

        const timeMs = Date.now() - startTime;
        const isCorrectResult = selectedChoice === prefetchedAnswer;

        // Play feedback sound
        const audioPath = isCorrectResult ? '/sfx/correct_2.mp3' : '/sfx/wrong_1.mp3';
        const audio = new Audio(audioPath);
        audio.play().catch(e => console.error("Audio playback stalled", e));

        try {
            const res = await fetch('/api/play/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problemId: problem.id,
                    chosenId: selectedChoice,
                    timeMs
                })
            });
            const result = await res.json();
            if (result.success) {
                // Optionally update UI with result.data.newRating
            }
        } catch (err) {
            console.error("Submission failed", err);
        } finally {
            setIsSubmitting(false);
        }
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

    const isCorrect = isVerified && selectedChoice === prefetchedAnswer;

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
                    {isVerified && (
                        <div className={`rating-label ${isCorrect ? 'text-success' : 'text-error'}`} style={{ fontWeight: 700 }}>
                            {isCorrect ? 'VERIFICATION SUCCESSFUL' : 'CALIBRATION DRIFT DETECTED'}
                        </div>
                    )}
                </div>

                <div className="problem-prompt">
                    {problem.promptLatex}
                </div>

                <div className="choice-grid">
                    {problem.choices.map((choice) => {
                        const isSelected = selectedChoice === choice.id;
                        const isCorrectAnswer = isVerified && choice.id === prefetchedAnswer;
                        const isWrongSelection = isVerified && isSelected && choice.id !== prefetchedAnswer;

                        let cardClass = "choice-card";
                        if (isSelected) cardClass += " selected";
                        if (isCorrectAnswer) cardClass += " correct-stable";
                        if (isWrongSelection) cardClass += " wrong-stable";

                        return (
                            <button
                                key={choice.id}
                                className={cardClass}
                                onClick={() => !isVerified && setSelectedChoice(choice.id)}
                                disabled={isVerified}
                                style={{ opacity: isVerified && !isSelected && !isCorrectAnswer ? 0.4 : 1 }}
                            >
                                <span className="choice-id">{choice.id}</span>
                                <span className="choice-content">{choice.content}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="play-footer">
                    {!isVerified ? (
                        <button
                            onClick={handleSubmit}
                            className="btn-submit"
                            disabled={!selectedChoice || isSubmitting}
                        >
                            {isSubmitting ? "PROCESSING..." : "Verify Calibration"}
                        </button>
                    ) : (
                        <button
                            onClick={fetchProblem}
                            className="btn-submit"
                            style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                        >
                            Next Problem →
                        </button>
                    )}
                </div>

                {isVerified && problem.solutions && (
                    <div style={{
                        marginTop: 'var(--space-12)',
                        padding: 'var(--space-8)',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px'
                    }}>
                        <div className="rating-label" style={{ marginBottom: 'var(--space-4)', opacity: 0.8 }}>
                            SOLUTION REVEALED
                        </div>
                        <div style={{ lineHeight: 1.6, fontSize: '15px' }}>
                            {problem.solutions}
                        </div>
                    </div>
                )}
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
