import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [
    { id: 'post-1', title: 'Launching Redux Toolkit', platformId: 'plt-1', status: 'Published' },
    { id: 'post-2', title: 'State Management Overview', platformId: 'plt-2', status: 'Draft' },
    { id: 'post-3', title: 'Reselect Optimization Guide', platformId: 'plt-1', status: 'Published' }
  ];
});

const initialState = {
  entities: {},
  ids: [],
  searchQuery: '',
  filterPlatform: 'ALL', // 'ALL' | 'plt-1' | 'plt-2' | 'plt-3'
  status: 'idle',
  error: null
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: (state, action) => {
      const { id, title, platformId, status } = action.payload;
      state.entities[id] = { id, title, platformId, status };
      state.ids.unshift(id);
    },
    postDeleted: (state, action) => {
      const id = action.payload;
      delete state.entities[id];
      state.ids = state.ids.filter((postId) => postId !== id);
    },
    postStatusUpdated: (state, action) => {
      const { id, status } = action.payload;
      if (state.entities[id]) {
        state.entities[id].status = status;
      }
    },
    // ⚡ NEW: Search and Filter Reducers
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterPlatform: (state, action) => {
      state.filterPlatform = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        action.payload.forEach((post) => {
          state.entities[post.id] = post;
          if (!state.ids.includes(post.id)) {
            state.ids.push(post.id);
          }
        });
      });
  }
});

export const { 
  postAdded, 
  postDeleted, 
  postStatusUpdated, 
  setSearchQuery, 
  setFilterPlatform 
} = postsSlice.actions;

export default postsSlice.reducer;

/* ==========================================================================
   ⚡ EXPERIMENT 1.2.2: MEMOIZED SELECTORS (RESELECT)
   ========================================================================== */

// 1. Basic Input Selectors (Raw state access)
export const selectAllPostsEntities = (state) => state.posts.entities;
export const selectAllPostIds = (state) => state.posts.ids;
export const selectSearchQuery = (state) => state.posts.searchQuery;
export const selectFilterPlatform = (state) => state.posts.filterPlatform;

// 2. Memoized Derived Selector using createSelector
// Computes filtered post IDs ONLY when entities, query, or filter change!
export const selectFilteredPostIds = createSelector(
  [selectAllPostsEntities, selectAllPostIds, selectSearchQuery, selectFilterPlatform],
  (entities, ids, query, filterPlatform) => {
    console.log('⚡ [Memoized Selector] Computing filtered posts list...');
    
    return ids.filter((id) => {
      const post = entities[id];
      if (!post) return false;

      const matchesSearch = post.title.toLowerCase().includes(query.toLowerCase());
      const matchesPlatform = filterPlatform === 'ALL' || post.platformId === filterPlatform;

      return matchesSearch && matchesPlatform;
    });
  }
);