"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ProblemView, MCQChoice } from "@/domain/problem";
import { getDomainAccentColor } from "@/lib/colors";

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

    const accentColor = problem?.subjectOrder ? getDomainAccentColor(problem.subjectOrder) : (worldSlug === 'math' ? '#4F8CFF' : worldSlug === 'physics' ? '#9C6BFF' : '#3B82F6');

    // Joy States
    const [streak, setStreak] = useState(0);
    const [displayRating, setDisplayRating] = useState<number | null>(null);
    const [isPulsing, setIsPulsing] = useState(false);
    const [ratingDelta, setRatingDelta] = useState<number | null>(null);

    async function fetchProblem() {
        setLoading(true);
        setError(null);
        setSelectedChoice(null);
        setPrefetchedAnswer(null);
        setIsVerified(false);
        setIsSubmitting(false);
        setRatingDelta(null);
        try {
            const res = await fetch(`/api/play/problem?archetypeSlug=${archetypeSlug}`);
            const result = await res.json();
            if (result.success) {
                setProblem(result.data);
                setStartTime(Date.now());
                if (displayRating === null) setDisplayRating(result.data.userRating);
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

    // Rating Animation Helper
    const animateRating = (target: number) => {
        if (displayRating === null) {
            setDisplayRating(target);
            return;
        }

        const start = displayRating;
        const duration = 300; // ms
        const startTime = performance.now();

        const update = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out elastic-ish overshoot
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.round(start + (target - start) * eased);

            setDisplayRating(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

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

        if (window.hasOwnProperty('renderMathInElement')) {
            renderMath();
        } else {
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
        }
    }, [problem, isVerified]);

    const handleSubmit = async () => {
        if (!selectedChoice || !problem || isVerified) return;

        setIsPulsing(true);
        setIsSubmitting(true);

        const timeMs = Date.now() - startTime;
        const isCorrectResult = selectedChoice === prefetchedAnswer;

        // Mandated Suspense Delay (180ms)
        await new Promise(resolve => setTimeout(resolve, 180));

        setIsPulsing(false);
        setIsVerified(true);

        // Play feedback sound
        const audioPath = isCorrectResult ? '/sfx/correct_2.mp3' : '/sfx/wrong_1.mp3';
        const audio = new Audio(audioPath);
        audio.play().catch(e => console.error("Audio playback stalled", e));

        if (isCorrectResult) {
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }

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
            if (result.success && result.data.newRating) {
                const delta = result.data.newRating - (problem.userRating || 0);
                setRatingDelta(delta);
                animateRating(result.data.newRating);
            }
        } catch (err) {
            console.error("Submission failed", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Avoid shortcuts if user is typing in an input (if any existed, currently none but good practice)
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            // 1. Choice Mappings (WASD -> A, B, C, D)
            if (!isVerified && !isSubmitting && !isPulsing) {
                const keyMap: Record<string, string> = {
                    'w': 'A', 'W': 'A',
                    'a': 'B', 'A': 'B',
                    's': 'C', 'S': 'C',
                    'd': 'D', 'D': 'D',
                };

                const choiceId = keyMap[e.key];
                if (choiceId) {
                    setSelectedChoice(choiceId);
                    const audio = new Audio('/sfx/select_1.mp3');
                    audio.play().catch(e => console.error("Selection audio stalled", e));
                    return;
                }
            }

            // 2. Submit (Enter)
            if (e.key === 'Enter') {
                if (!isVerified && selectedChoice && !isSubmitting && !isPulsing) {
                    handleSubmit();
                } else if (isVerified) {
                    fetchProblem();
                }
            }

            // 3. Next Problem / Skip (Right Arrow)
            if (e.key === 'ArrowRight') {
                if (isVerified || (!isVerified && !isSubmitting && !isPulsing)) {
                    fetchProblem();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVerified, selectedChoice, isSubmitting, isPulsing, problem]);

    if (loading) {
        return (
            <div className="home-container" style={{ textAlign: "center", justifyContent: "center", minHeight: "60vh" }}>
                <div className="rating-label" style={{ animation: 'pulse-opacity 1s infinite' }}>Isolating Variables</div>
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
    const streakHeatClass = streak >= 6 ? "streak-heat-3" : streak >= 4 ? "streak-heat-2" : streak >= 2 ? "streak-heat-1" : "";

    return (
        <div className={`play-container ${streakHeatClass}`} style={{ '--accent': accentColor } as any}>
            <header className="home-header" style={{ borderBottom: 'none', marginBottom: 'var(--space-6)', paddingBottom: 0 }}>
                <div style={{ width: '100%', display: 'flex', gap: '32px' }}>
                    <div style={{ flex: 1 }}>
                        <Link href={`/world/${worldSlug}/${domainSlug}`} className="rating-label" style={{
                            textDecoration: "none",
                            opacity: 0.5
                        }}>
                            ← ABANDON SESSION
                        </Link>
                        <h1 style={{ marginTop: '8px', fontSize: '28px' }}>{problem.topic}</h1>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', opacity: 0.3, marginTop: '4px' }}>
                            {problem.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="rating-label" style={{ fontSize: '9px' }}>
                                    #{tag.toUpperCase()}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div className="rating-container" style={{ textAlign: 'right' }}>
                            <span className="rating-label">Status</span>
                            <span className="rating-value" style={{
                                color: streak > 0 ? 'var(--accent)' : 'inherit',
                                fontSize: '18px',
                                textShadow: streak >= 4 ? '0 0 15px var(--accent)' : 'none'
                            }}>
                                STREAK {streak}
                            </span>
                        </div>
                        <div className="rating-container" style={{ textAlign: 'right' }}>
                            <span className="rating-label">Calibration</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                <span className={`rating-value ${ratingDelta ? 'rating-tick-up' : ''}`} style={{ fontSize: '18px' }}>
                                    {displayRating ?? problem.userRating ?? "---"}
                                </span>
                                {ratingDelta && (
                                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--success)' }}>
                                        +{ratingDelta}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Vertical Mastery Ladder Visual */}
                        <div style={{
                            width: '12px',
                            height: '60px',
                            background: 'var(--border)',
                            borderRadius: '6px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            padding: '2px',
                            gap: '2px'
                        }} title="Mastery Ascent">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} style={{
                                    flex: 1,
                                    borderRadius: '2px',
                                    background: ((displayRating || 200) / 1900) * 5 > i ? 'var(--accent)' : 'transparent',
                                    boxShadow: ((displayRating || 200) / 1900) * 5 > i ? '0 0 8px var(--accent)' : 'none',
                                    opacity: ((displayRating || 200) / 1900) * 5 > i ? 1 : 0.2,
                                    transition: 'all 0.6s var(--ease-out-quint)'
                                }} />
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <div className={`problem-container ${isCorrect ? 'correct-glow' : ''}`} style={{ padding: 'var(--space-8)', gap: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="rating-label" style={{ fontSize: '11px', opacity: 0.5 }}>
                        DOMAIN DEPTH: {problem.rating}
                    </div>
                    {isVerified && (
                        <div className={`rating-label ${isCorrect ? 'text-success' : 'text-error'}`} style={{
                            fontWeight: 900,
                            letterSpacing: '0.15em',
                            fontSize: '11px',
                            animation: isCorrect ? 'none' : 'wrong-shake 0.3s'
                        }}>
                            {isCorrect ? '✓ VERIFIED' : '✗ DRIFT'}
                        </div>
                    )}
                </div>

                <div className="problem-prompt" style={{ minHeight: '80px', fontSize: '20px' }}>
                    {problem.promptLatex}
                </div>

                <div className="choice-grid" style={{ marginTop: '0' }}>
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
                                onClick={() => {
                                    if (!isVerified) {
                                        setSelectedChoice(choice.id);
                                        const audio = new Audio('/sfx/select_1.mp3');
                                        audio.play().catch(e => console.error("Selection audio stalled", e));
                                    }
                                }}
                                disabled={isVerified}
                                style={{
                                    opacity: isVerified && !isSelected && !isCorrectAnswer ? 0.3 : 1,
                                    transition: 'opacity 0.4s ease'
                                }}
                            >
                                <span className="choice-id">{choice.id}</span>
                                <span className="choice-content">{choice.content}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="play-footer" style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
                    {!isVerified ? (
                        <>
                            <button
                                onClick={fetchProblem}
                                className="btn-submit"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-muted)',
                                    paddingLeft: 'var(--space-8)',
                                    paddingRight: 'var(--space-8)',
                                    flex: '0 1 auto',
                                    fontSize: '14px'
                                }}
                                disabled={isSubmitting || isPulsing}
                            >
                                Next Problem
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={`btn-submit ${isPulsing ? 'suspense' : ''}`}
                                disabled={!selectedChoice || isSubmitting}
                                style={{ flex: 1, maxWidth: '300px' }}
                            >
                                {isPulsing ? "CALIBRATING..." : isSubmitting ? "PROCESSING..." : "Verify Calibration"}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={fetchProblem}
                            className="btn-submit"
                            style={{
                                background: 'var(--text-primary)',
                                color: 'var(--bg-primary)',
                                paddingLeft: 'var(--space-12)',
                                paddingRight: 'var(--space-12)'
                            }}
                        >
                            Next Problem →
                        </button>
                    )}
                </div>

                {isVerified && problem.solutions && (
                    <div style={{
                        marginTop: 'var(--space-8)',
                        padding: 'var(--space-8)',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        animation: 'fadeIn 0.4s ease-out'
                    }}>
                        <div className="rating-label" style={{ marginBottom: 'var(--space-4)', opacity: 0.8 }}>
                            SOLUTION PROTOCOL
                        </div>
                        <div style={{ lineHeight: 1.6, fontSize: '16px', color: 'var(--text-secondary)' }}>
                            {problem.solutions}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', opacity: 0.4 }}>
                {problem.tags.map(tag => (
                    <span key={tag} className="rating-label" style={{ fontSize: '10px' }}>
                        #{tag.toUpperCase()}
                    </span>
                ))}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
