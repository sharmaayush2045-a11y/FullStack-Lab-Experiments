import React from 'react';
import { Sparkles, Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AIOptimizationSidebar({ analysis, onQuickSchedule }) {
  const {
    selectedDate,
    postCount,
    overallProbability,
    status,
    badgeColor,
    aiAdvice,
    recommendedSlots,
    postsOnDate,
  } = analysis;

  return (
    <div
      style={{
        width: '320px',
        background: '#ffffff',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '6px' }}>
          <Sparkles size={18} color="#2563eb" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>
            AI Schedule Inspector
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Predictive posting probability
          </span>
        </div>
      </div>

      {/* Selected Date Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#f8fafc',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#334155',
        }}
      >
        <CalendarIcon size={15} color="#64748b" />
        <span>Selected: {selectedDate}</span>
      </div>

      {/* Probability Circular / Metric Bar Gauge */}
      <div
        style={{
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
          SUCCESS PROBABILITY
        </span>
        <div style={{ fontSize: '32px', fontWeight: 800, color: badgeColor, margin: '4px 0' }}>
          {overallProbability}%
        </div>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: `${badgeColor}15`,
            color: badgeColor,
          }}
        >
          {status}
        </span>

        {/* Progress Fill Bar */}
        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e2e8f0',
            borderRadius: '3px',
            marginTop: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${overallProbability}%`,
              height: '100%',
              backgroundColor: badgeColor,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* AI Insight Box */}
      <div
        style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#166534',
          lineHeight: '1.5',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, marginBottom: '4px' }}>
          <CheckCircle2 size={14} color="#16a34a" /> AI Optimization Verdict:
        </div>
        {aiAdvice}
      </div>

      {/* Active Events on This Day */}
      <div>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
          Current Density ({postCount} Scheduled):
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
          {postsOnDate.length === 0 ? (
            <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
              No posts scheduled for this date.
            </span>
          ) : (
            postsOnDate.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8fafc',
                  borderLeft: `3px solid ${p.backgroundColor || '#2563eb'}`,
                  padding: '6px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                <span style={{ fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                  {p.title}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{p.platform}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recommended Peak Windows */}
      <div>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
          Suggested Peak Windows:
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
          {recommendedSlots.map((slot, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 10px',
                background: '#f8fafc',
                borderRadius: '6px',
                border: '1px solid #f1f5f9',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                <Clock size={13} color="#64748b" />
                <span>{slot.time}</span>
              </div>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                {slot.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Button */}
      <button
        onClick={() => onQuickSchedule(selectedDate)}
        style={{
          marginTop: 'auto',
          background: '#0f172a',
          color: '#ffffff',
          border: 'none',
          padding: '10px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        Schedule on {selectedDate.slice(5)}
      </button>
    </div>
  );
}