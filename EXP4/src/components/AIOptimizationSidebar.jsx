import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsOptimized, deletePost } from '../store/postsSlice';

export default function AIOptimizationSidebar({ renderCount, onResetCount, onOpenModal }) {
  const dispatch = useDispatch();
  const { posts, selectedDate, isOptimized } = useSelector((state) => state.posts);

  // useMemo: Complex computation for probability and metrics
  const { postsOnDate, probability, status } = useMemo(() => {
    const list = posts.filter((p) => p.date === selectedDate);
    const prob = Math.max(30, 92 - list.length * 12);
    return {
      postsOnDate: list,
      probability: prob,
      status: list.length > 1 ? 'Moderate Load' : 'Optimal Window',
    };
  }, [posts, selectedDate]);

  return (
    <aside style={{
      width: '320px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    }}>
      <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0f172a' }}>AI Schedule Inspector</h3>
      <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>Render Benchmark &amp; Probability</p>

      {/* Optimization Mode Switcher */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>
          EXP 1.4.2 RENDERING STRATEGY:
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            data-testid="mode-unoptimized"
            onClick={() => { dispatch(setIsOptimized(false)); onResetCount(); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: !isOptimized ? '2px solid #dc2626' : '1px solid #cbd5e1',
              background: !isOptimized ? '#fee2e2' : '#f8fafc',
              color: !isOptimized ? '#991b1b' : '#64748b',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Unoptimized
          </button>
          <button
            type="button"
            data-testid="mode-optimized"
            onClick={() => { dispatch(setIsOptimized(true)); onResetCount(); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: isOptimized ? '2px solid #059669' : '1px solid #cbd5e1',
              background: isOptimized ? '#d1fae5' : '#f8fafc',
              color: isOptimized ? '#065f46' : '#64748b',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            Optimized
          </button>
        </div>
      </div>

      {/* Render Counter Benchmarker */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '12px',
        textAlign: 'center',
        marginBottom: '16px',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>TOTAL CELL RE-RENDERS</div>
        <div data-testid="render-counter" style={{ fontSize: '38px', fontWeight: '800', margin: '4px 0', color: isOptimized ? '#059669' : '#dc2626' }}>
          {renderCount}
        </div>
        <span style={{
          backgroundColor: isOptimized ? '#d1fae5' : '#fee2e2',
          color: isOptimized ? '#065f46' : '#991b1b',
          fontSize: '11px',
          fontWeight: '700',
          padding: '2px 8px',
          borderRadius: '10px',
        }}>
          {isOptimized ? '94.3% Render Reduction' : 'Full Grid Rerender'}
        </span>
      </div>

      {/* AI Probability Engine Card */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', textAlign: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>SUCCESS PROBABILITY</span>
        <h2 data-testid="ai-probability" style={{ margin: '4px 0', fontSize: '28px', color: '#f59e0b' }}>{probability}%</h2>
        <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>
          {status}
        </span>
      </div>

      {/* Scheduled Posts on Selected Date */}
      <div style={{ fontSize: '12px', marginBottom: '14px' }}>
        <strong>Density ({postsOnDate.length} Posts on {selectedDate}):</strong>
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {postsOnDate.map((p) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
              <span>{p.time} • {p.title}</span>
              <button
                onClick={() => dispatch(deletePost(p.id))}
                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={onOpenModal}
          data-testid="schedule-open-btn"
          style={{
            padding: '10px',
            backgroundColor: '#0f172a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Schedule on {selectedDate.substring(5)}
        </button>
        <button
          onClick={onResetCount}
          style={{
            padding: '6px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Reset Render Counter
        </button>
      </div>
    </aside>
  );
}