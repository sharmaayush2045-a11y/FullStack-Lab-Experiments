import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [
    { id: 'post-1', title: 'Launching Redux Toolkit', platformId: 'plt-1', status: 'Published' },
    { id: 'post-2', title: 'State Management Overview', platformId: 'plt-2', status: 'Draft' }
  ];
});

const initialState = {
  entities: {},
  ids: [],
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

export const { postAdded, postDeleted } = postsSlice.actions;
export default postsSlice.reducer;