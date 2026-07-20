import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, postAdded, postDeleted } from './features/posts/postsSlice';
import { togglePlatformStatus } from './features/platforms/platformsSlice';
import './App.css';

export default function App() {
  const dispatch = useDispatch();
  const { ids: postIds, entities: posts, status } = useSelector((state) => state.posts);
  const platforms = useSelector((state) => state.platforms.entities);
  const platformIds = useSelector((state) => state.platforms.ids);

  const [title, setTitle] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('plt-1');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(
      postAdded({
        id: `post-${Date.now()}`,
        title,
        platformId: selectedPlatform,
        status: 'Draft'
      })
    );
    setTitle('');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Centralized Post Manager</h1>
        <p>Redux Toolkit State Management System</p>
      </header>

      {/* Platform Toggles */}
      <section className="section-card">
        <h3>Target Platforms</h3>
        <div className="platform-grid">
          {platformIds.map((id) => {
            const platform = platforms[id];
            return (
              <button
                key={id}
                onClick={() => dispatch(togglePlatformStatus(id))}
                className={`platform-btn ${platform.active ? 'active' : 'inactive'}`}
              >
                <span className="status-dot"></span>
                {platform.name}: {platform.active ? 'Active' : 'Inactive'}
              </button>
            );
          })}
        </div>
      </section>

      {/* Add Post Form */}
      <section className="section-card">
        <h3>Create New Post</h3>
        <form onSubmit={handleAddPost} className="create-form">
          <input
            type="text"
            className="form-input"
            placeholder="Write post content..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select 
            value={selectedPlatform} 
            onChange={(e) => setSelectedPlatform(e.target.value)} 
            className="form-select"
          >
            {platformIds.map((id) => (
              <option key={id} value={id}>
                {platforms[id].name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary">
            Add Post
          </button>
        </form>
      </section>

      {/* Posts List */}
      <section className="section-card">
        <h3>
          Posts 
          {status === 'loading' && <span className="loading-text">Fetching posts...</span>}
        </h3>
        
        <div className="post-list">
          {postIds.map((id) => {
            const post = posts[id];
            const platform = platforms[post.platformId];

            return (
              <div key={id} className="post-item">
                <div>
                  <div className="post-title">{post.title}</div>
                  <div className="post-meta">
                    <span>Platform: <strong className="badge">{platform ? platform.name : 'Unknown'}</strong></span>
                    <span>Status: <strong className="badge">{post.status}</strong></span>
                  </div>
                </div>
                <button 
                  onClick={() => dispatch(postDeleted(id))} 
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}