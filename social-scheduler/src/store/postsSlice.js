import { createSlice } from '@reduxjs/toolkit';

const initialCalendarPosts = [
  {
    id: '1',
    title: '🚀 Product Launch Announcement',
    platform: 'Twitter',
    content: 'Excited to announce our new feature release today!',
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    backgroundColor: '#1DA1F2',
  },
  {
    id: '2',
    title: '📊 Weekly Tech Retrospective',
    platform: 'LinkedIn',
    content: 'Deep-dive into UI performance and memoization techniques.',
    start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    backgroundColor: '#0A66C2',
  },
  {
    id: '3',
    title: '📸 Behind the Scenes Visuals',
    platform: 'Instagram',
    content: 'Photos from our recent design sprint.',
    start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    backgroundColor: '#E1306C',
  },
];

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: initialCalendarPosts,
    activePlatform: 'ALL',
  },
  reducers: {
    addPost: (state, action) => {
      state.items.push(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    reschedulePost: (state, action) => {
      const { id, newStart, newEnd } = action.payload;
      const post = state.items.find((p) => p.id === id);
      if (post) {
        post.start = newStart;
        if (newEnd) post.end = newEnd;
      }
    },
    deletePost: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    setPlatformFilter: (state, action) => {
      state.activePlatform = action.payload;
    },
  },
});

export const {
  addPost,
  updatePost,
  reschedulePost,
  deletePost,
  setPlatformFilter,
} = postsSlice.actions;

export default postsSlice.reducer;