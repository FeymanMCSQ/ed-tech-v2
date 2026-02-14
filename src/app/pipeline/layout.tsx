import React from 'react';
import PipelineSidebar from './components/PipelineSidebar';

export default function PipelineLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="pipeline-layout" style={{
            display: 'flex',
            width: '100%',
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: 'var(--bg-primary)',
        }}>
            <PipelineSidebar />
            <main style={{
                flex: 1,
                padding: 'var(--space-12) var(--space-8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                overflowY: 'auto',
            }}>
                {children}
            </main>
        </div>
    );
}
