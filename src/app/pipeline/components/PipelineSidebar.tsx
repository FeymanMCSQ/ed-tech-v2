"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookOpen,
    Layers,
    Database,
    BarChart3,
    Sparkles,
    Search,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard
} from 'lucide-react';

const pipelineRoutes = [
    { name: 'Subjects', path: '/pipeline/subjects', icon: BookOpen },
    { name: 'Domains', path: '/pipeline/domains', icon: Layers },
    { name: 'Archetypes', path: '/pipeline/archetypes', icon: Database },
    { name: 'Enumerate', path: '/pipeline/enumerate', icon: BarChart3 },
    { name: 'Generate', path: '/pipeline/generate', icon: Sparkles },
    { name: 'Lookup', path: '/pipeline/lookup', icon: Search },
    { name: 'Rating Change', path: '/pipeline/ratingChange', icon: TrendingUp },
];

export default function PipelineSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside style={{
            width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
            backgroundColor: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border)',
            transition: 'width var(--sidebar-transition)',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: '64px', // Adjusted for Navbar height
            height: 'calc(100vh - 64px)',
            zIndex: 40,
            overflow: 'hidden',
        }}>
            {/* Header / Toggle */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                padding: isCollapsed ? 'var(--space-4) 0' : 'var(--space-6)',
                borderBottom: '1px solid var(--border)',
                minHeight: '64px',
            }}>
                {!isCollapsed && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <LayoutDashboard size={20} style={{ color: 'var(--accent)' }} />
                        <span style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Pipeline</span>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        transition: 'all 200ms ease',
                    }}
                    className="toggle-btn"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Navigation Links */}
            <nav style={{
                flex: 1,
                padding: isCollapsed ? 'var(--space-4) var(--space-2)' : 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)'
            }}>
                {pipelineRoutes.map((route) => {
                    const isActive = pathname === route.path;
                    const Icon = route.icon;

                    return (
                        <Link
                            key={route.path}
                            href={route.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: isCollapsed ? '0' : 'var(--space-4)',
                                padding: isCollapsed ? '12px 0' : '12px 16px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                backgroundColor: isActive ? 'rgba(var(--accent-rgb), 0.15)' : 'transparent',
                                border: `1px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                                transition: 'all 250ms var(--ease-out-quint)',
                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                position: 'relative',
                            }}
                            className="nav-link"
                            title={isCollapsed ? route.name : ''}
                        >
                            <Icon size={20} style={{
                                color: isActive ? 'var(--accent)' : 'inherit',
                                transition: 'color 250ms ease',
                                flexShrink: 0
                            }} />

                            <span style={{
                                fontWeight: isActive ? 700 : 500,
                                fontSize: '14px',
                                width: isCollapsed ? '0' : 'auto',
                                opacity: isCollapsed ? 0 : 1,
                                transform: isCollapsed ? 'translateX(-10px)' : 'translateX(0)',
                                transition: 'all var(--sidebar-transition)',
                                whiteSpace: 'nowrap',
                                pointerEvents: isCollapsed ? 'none' : 'auto',
                                display: 'inline-block',
                                overflow: 'hidden',
                            }}>
                                {route.name}
                            </span>

                            {isActive && !isCollapsed && (
                                <div style={{
                                    position: 'absolute',
                                    right: '12px',
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--accent)',
                                }} />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Context */}
            <div style={{
                padding: isCollapsed ? 'var(--space-4) 0' : 'var(--space-6)',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'center',
            }}>
                {isCollapsed ? (
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 900,
                        color: 'var(--text-muted)',
                        backgroundColor: 'rgba(255,255,255,0.02)'
                    }}>F</div>
                ) : (
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                        Feynman v2.0
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .nav-link:hover {
                    background-color: rgba(255, 255, 255, 0.03);
                    color: white;
                }
                .toggle-btn:hover {
                    background-color: rgba(255, 255, 255, 0.08);
                    color: white;
                }
            `}</style>
        </aside>
    );
}
