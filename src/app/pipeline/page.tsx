"use client";

import React from 'react';
import Link from 'next/link';
import {
    BookOpen,
    Layers,
    Database,
    BarChart3,
    Sparkles,
    Search,
    TrendingUp,
    ArrowRight
} from 'lucide-react';

const pipelineModules = [
    {
        title: 'Subjects',
        description: 'Manage high-level academic fields and core curriculum areas.',
        path: '/pipeline/subjects',
        icon: BookOpen,
        color: 'var(--accent)'
    },
    {
        title: 'Domains',
        description: 'Define specific knowledge domains and sub-topic hierarchies.',
        path: '/pipeline/domains',
        icon: Layers,
        color: '#6366f1' // Indigo
    },
    {
        title: 'Archetypes',
        description: 'Configure technical move-sets and cognitive patterns.',
        path: '/pipeline/archetypes',
        icon: Database,
        color: '#8b5cf6' // Violet
    },
    {
        title: 'Problem Enumerate',
        description: 'Audit and inventory the existing problem seed universe.',
        path: '/pipeline/enumerate',
        icon: BarChart3,
        color: '#ec4899' // Pink
    },
    {
        title: 'Synthesis Engine',
        description: 'Systemically generate new problems using tuned ELO bands.',
        path: '/pipeline/generate',
        icon: Sparkles,
        color: '#f59e0b' // Amber
    },
    {
        title: 'Lookup Hub',
        description: 'Trace and inspect specific problem instances and metadata.',
        path: '/pipeline/lookup',
        icon: Search,
        color: '#10b981' // Emerald
    },
    {
        title: 'Rating Calibration',
        description: 'Adjust difficulty coefficients and ELO distributions.',
        path: '/pipeline/ratingChange',
        icon: TrendingUp,
        color: '#3b82f6' // Blue
    }
];

export default function PipelineDashboard() {
    return (
        <div style={{
            maxWidth: '1200px',
            width: '100%',
            animation: 'fadeIn 0.8s var(--ease-out-quint)'
        }}>
            <header style={{ marginBottom: 'var(--space-12)', textAlign: 'center' }}>
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    marginBottom: 'var(--space-2)',
                    background: 'linear-gradient(135deg, #fff 0%, var(--text-muted) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Pipeline Control
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                    The mission control for the Feynman problem engine. Securely browse, generate, and calibrate the knowledge graph.
                </p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: 'var(--space-6)',
                padding: 'var(--space-2)'
            }}>
                {pipelineModules.map((module, idx) => {
                    const Icon = module.icon;
                    return (
                        <Link
                            key={module.path}
                            href={module.path}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="module-card" style={{
                                backgroundColor: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '24px',
                                padding: 'var(--space-8)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-6)',
                                transition: 'all 0.4s var(--ease-out-quint)',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                animation: `slideUp 0.6s var(--ease-out-quint) ${idx * 0.05}s both`
                            }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '16px',
                                    backgroundColor: `rgba(${module.color === 'var(--accent)' ? 'var(--accent-rgb)' : '100, 100, 100'}, 0.1)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: module.color,
                                    border: `1px solid rgba(${module.color === 'var(--accent)' ? 'var(--accent-rgb)' : '100, 100, 100'}, 0.2)`
                                }}>
                                    <Icon size={28} />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: 'var(--space-2)', color: 'white' }}>
                                        {module.title}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                                        {module.description}
                                    </p>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: 'var(--accent)',
                                    marginTop: 'auto'
                                }}>
                                    Open Module <ArrowRight size={14} />
                                </div>

                                {/* Decorative Background Glow */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-20%',
                                    right: '-20%',
                                    width: '120px',
                                    height: '120px',
                                    background: module.color,
                                    filter: 'blur(80px)',
                                    opacity: 0.05,
                                    pointerEvents: 'none'
                                }} />
                            </div>
                        </Link>
                    )
                })}
            </div>

            <style jsx>{`
                .module-card:hover {
                    transform: translateY(-8px);
                    border-color: var(--accent);
                    background-color: rgba(255, 255, 255, 0.02);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}
