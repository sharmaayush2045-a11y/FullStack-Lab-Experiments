import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entities: {
    'plt-1': { id: 'plt-1', name: 'Twitter / X', active: true },
    'plt-2': { id: 'plt-2', name: 'LinkedIn', active: true },
    'plt-3': { id: 'plt-3', name: 'Instagram', active: false }
  },
  ids: ['plt-1', 'plt-2', 'plt-3']
};

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    togglePlatformStatus: (state, action) => {
      const platformId = action.payload;
      if (state.entities[platformId]) {
        state.entities[platformId].active = !state.entities[platformId].active;
      }
    }
  }
});

export const { togglePlatformStatus } = platformsSlice.actions;
export default platformsSlice.reducer;