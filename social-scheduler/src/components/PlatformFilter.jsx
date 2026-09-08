import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActivePlatform } from '../store/postsSlice';

const platforms = ['ALL', 'Twitter', 'LinkedIn', 'Instagram', 'Facebook'];

export default function PlatformFilter() {
  const dispatch = useDispatch();
  const { posts, activePlatform } = useSelector((state) => state.posts);

  const getCount = (platform) => {
    if (platform === 'ALL') return posts.length;
    return posts.filter((p) => p.platform.toLowerCase() === platform.toLowerCase()).length;
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      {platforms.map((platform) => {
        const isActive = activePlatform === platform;
        return (
          <button
            key={platform}
            data-testid={`filter-${platform.toLowerCase()}`}
            onClick={() => dispatch(setActivePlatform(platform))}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: isActive ? '1px solid #0f172a' : '1px solid #cbd5e1',
              backgroundColor: isActive ? '#0f172a' : '#ffffff',
              color: isActive ? '#ffffff' : '#475569',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '12px',
            }}
          >
            {platform} ({getCount(platform)})
          </button>
        );
      })}
    </div>
  );
}