import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchPosts, 
  postAdded, 
  postDeleted, 
  postStatusUpdated,
  setSearchQuery,
  setFilterPlatform,
  selectFilteredPostIds,
  selectSearchQuery,
  selectFilterPlatform
} from './features/posts/postsSlice';
import { togglePlatformStatus } from './features/platforms/platformsSlice';
import PostItem from './components/PostItem';
import './App.css';

export default function App() {
  const dispatch = useDispatch();

  // ⚡ Using Memoized Selector from Reselect
  const filteredPostIds = useSelector(selectFilteredPostIds);
  const searchQuery = useSelector(selectSearchQuery);
  const currentFilter = useSelector(selectFilterPlatform);
  
  const posts = useSelector((state) => state.posts.entities);
  const status = useSelector((state) => state.posts.status);
  const platforms = useSelector((state) => state.platforms.entities);
  const platformIds = useSelector((state) => state.platforms.ids);

  const [title, setTitle] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('plt-1');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  // Memoized handlers using useCallback to prevent React.memo breakage
  const handleDelete = useCallback((id) => {
    dispatch(postDeleted(id));
  }, [dispatch]);

  const handleStatusUpdate = useCallback((id, newStatus) => {
    dispatch(postStatusUpdated({ id, status: newStatus }));
  }, [dispatch]);

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
        <p>Experiment 1.2.2: Memoized Selectors & Performance Optimization</p>
      </header>

      {/* Target Platforms */}
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

      {/* ⚡ NEW: Search & Filter Controls Section */}
      <section className="section-card">
        <h3>Search & Filter Derived State</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search posts by title..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
          <select
            value={currentFilter}
            onChange={(e) => dispatch(setFilterPlatform(e.target.value))}
            className="form-select"
          >
            <option value="ALL">All Platforms</option>
            {platformIds.map((id) => (
              <option key={id} value={id}>
                {platforms[id].name}
              </option>
            ))}
          </select>
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
          Posts List ({filteredPostIds.length})
          {status === 'loading' && <span className="loading-text"> Fetching logs...</span>}
        </h3>
        
        <div className="post-list">
          {filteredPostIds.map((id) => (
            <PostItem
              key={id}
              post={posts[id]}
              platform={platforms[posts[id]?.platformId]}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      </section>
    </div>
  );
}