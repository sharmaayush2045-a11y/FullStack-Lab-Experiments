import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import PostCalendar from './components/PostCalendar';

export default function App() {
  return (
    <Provider store={store}>
      <PostCalendar />
    </Provider>
  );
}