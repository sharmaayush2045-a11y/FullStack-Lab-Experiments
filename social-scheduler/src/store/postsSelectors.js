import { createSelector } from '@reduxjs/toolkit';

const selectPostsState = (state) => state.posts.items;
const selectActivePlatform = (state) => state.posts.activePlatform;

export const selectFilteredPosts = createSelector(
  [selectPostsState, selectActivePlatform],
  (items, platform) => {
    if (!platform || platform === 'ALL') return items;
    return items.filter((post) => post.platform === platform);
  }
);

export const selectPlatformMetrics = createSelector(
  [selectPostsState],
  (items) => {
    return items.reduce(
      (acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
        acc.total += 1;
        return acc;
      },
      { total: 0 }
    );
  }
);