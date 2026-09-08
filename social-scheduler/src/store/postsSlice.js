import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDate: '2026-09-09',
  viewMode: 'month', // 'month' | 'week' | 'day'
  activePlatform: 'ALL',
  isOptimized: true, // Toggle for Experiment 1.4.2
  posts: [
    { id: '1', title: 'Weekly Tech Retrospective', platform: 'LinkedIn', date: '2026-09-09', time: '11:17' },
    { id: '2', title: 'Weekly tech highlights', platform: 'Twitter', date: '2026-09-09', time: '12:29' },
    { id: '3', title: 'Team Showcase Reel', platform: 'Instagram', date: '2026-09-10', time: '11:17' },
    { id: '4', title: 'Product Launch v2', platform: 'Twitter', date: '2026-09-11', time: '10:00' },
  ],
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setActivePlatform: (state, action) => {
      state.activePlatform = action.payload;
    },
    setIsOptimized: (state, action) => {
      state.isOptimized = action.payload;
    },
    addPost: (state, action) => {
      state.posts.push({
        id: Date.now().toString(),
        ...action.payload,
      });
    },
    reschedulePost: (state, action) => {
      const { id, targetDate, targetTime } = action.payload;
      const post = state.posts.find((p) => p.id === id);
      if (post) {
        post.date = targetDate;
        if (targetTime) post.time = targetTime;
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },
  },
});

export const {
  setSelectedDate,
  setViewMode,
  setActivePlatform,
  setIsOptimized,
  addPost,
  reschedulePost,
  deletePost,
} = postsSlice.actions;

export default postsSlice.reducer;