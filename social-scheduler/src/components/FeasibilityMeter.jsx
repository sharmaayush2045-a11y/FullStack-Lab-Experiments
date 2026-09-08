import React from 'react';

export default function FeasibilityMeter({ metric }) {
  const { score, status, reason, color } = metric;

  return (
    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
          Scheduling Feasibility Score:
        </span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: color }}>
          {score}% ({status})
        </span>
      </div>

      <div style={{ width: '100%', height: '7px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${score}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.3s ease-in-out',
          }}
        />
      </div>

      <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748b' }}>
        {reason}
      </p>
    </div>
  );
}