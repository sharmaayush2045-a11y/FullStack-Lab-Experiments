export const selectAllPosts = (state) => state.posts.posts;
export const selectSelectedDate = (state) => state.posts.selectedDate;
export const selectActivePlatform = (state) => state.posts.activePlatform;
export const selectViewMode = (state) => state.posts.viewMode;

export const selectFilteredPosts = (state) => {
  const { posts, activePlatform } = state.posts;
  if (activePlatform === 'ALL') return posts;
  return posts.filter((p) => p.platform.toLowerCase() === activePlatform.toLowerCase());
};

export const selectPostsForSelectedDate = (state) => {
  const { posts, selectedDate } = state.posts;
  return posts.filter((p) => p.date === selectedDate);
};