import React, { useState, useCallback } from 'react';
import PlatformFilter from './components/PlatformFilter';
import PostCalendar from './components/PostCalendar';
import AIOptimizationSidebar from './components/AIOptimizationSidebar';
import PostModal from './components/PostModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  // useCallback: Stable callback to accumulate renders on user interactions
  const handleCellClickDelta = useCallback((delta) => {
    setRenderCount((prev) => prev + delta);
  }, []);

  const handleResetCount = useCallback(() => {
    setRenderCount(0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px 32px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '16px' }}>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '22px', color: '#0f172a' }}>
          Social Schedule Planner
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Experiments 1.4.1 &amp; 1.4.2: Temporal Calendar, Redux State, &amp; Render Optimization
        </p>
      </header>

      <PlatformFilter />

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <PostCalendar onCellClickDelta={handleCellClickDelta} />
        <AIOptimizationSidebar
          renderCount={renderCount}
          onResetCount={handleResetCount}
          onOpenModal={() => setIsModalOpen(true)}
        />
      </div>

      <PostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}