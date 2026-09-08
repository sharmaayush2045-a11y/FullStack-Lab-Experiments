import React from 'react';

const PLATFORMS = ['ALL', 'Twitter', 'LinkedIn', 'Instagram', 'Facebook'];

const PlatformFilter = React.memo(({ activePlatform, onSelectPlatform, metrics }) => {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
      {PLATFORMS.map((platform) => {
        const count = platform === 'ALL' ? metrics.total : (metrics[platform] || 0);
        const isActive = activePlatform === platform;

        return (
          <button
            key={platform}
            onClick={() => onSelectPlatform(platform)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              backgroundColor: isActive ? '#0f172a' : '#ffffff',
              color: isActive ? '#ffffff' : '#334155',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.15s ease',
            }}
          >
            {platform} ({count})
          </button>
        );
      })}
    </div>
  );
});

PlatformFilter.displayName = 'PlatformFilter';
export default PlatformFilter;