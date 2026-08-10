// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, decodeToken, removeToken } from '../utils/jwtHelper';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const token = getToken();
  const user = token ? decodeToken(token) : null;
  const role = user?.role || 'Guest';

  // State for interactive posts management
  const [posts, setPosts] = useState([
    { id: 1, title: 'Welcome to Experiment 1.3', author: 'System', content: 'This post is visible to all roles.' },
    { id: 2, title: 'RBAC Permission Matrix', author: 'Admin', content: 'Admins can delete any post, Editors can add posts.' }
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'token'

  const handleLogoutClick = () => {
    removeToken();
    onLogout();
    navigate('/login');
  };

  // Create Post Handler (Allowed for Editor & Admin)
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      author: user?.name || 'Anonymous'
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
  };

  // Delete Post Handler (Allowed ONLY for Admin)
  const handleDeletePost = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  return (
    <div style={styles.container}>
      {/* User Header Info */}
      <div style={styles.headerBox}>
        <div>
          <h2 style={{ margin: 0 }}>Welcome, {user?.name || 'User'} 👋</h2>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>{user?.email}</p>
        </div>
        <div>
          <span style={styles.roleBadge(role)}>{role} Role</span>
        </div>
      </div>

      {/* Navigation & Tab Controls */}
      <div style={styles.tabs}>
        <button 
          style={activeTab === 'posts' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('posts')}
        >
          📝 Interactive Feed
        </button>
        <button 
          style={activeTab === 'token' ? styles.activeTabBtn : styles.tabBtn} 
          onClick={() => setActiveTab('token')}
        >
          🔑 JWT Token Inspector
        </button>
      </div>

      {/* TAB 1: INTERACTIVE POSTS & PERMISSIONS */}
      {activeTab === 'posts' && (
        <div>
          {/* Post Creation Form (Editors & Admins Only) */}
          {(role === 'Editor' || role === 'Admin') ? (
            <div style={styles.card}>
              <h3>Create New Post</h3>
              <form onSubmit={handleAddPost}>
                <div style={styles.field}>
                  <input 
                    type="text" 
                    placeholder="Post Title..." 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.field}>
                  <textarea 
                    placeholder="Write your post content..." 
                    value={newContent} 
                    onChange={(e) => setNewContent(e.target.value)} 
                    style={{ ...styles.input, height: '60px' }}
                    required
                  />
                </div>
                <button type="submit" style={styles.addBtn}>Publish Post</button>
              </form>
            </div>
          ) : (
            <div style={styles.readOnlyNotice}>
              ℹ️ You are logged in as a <strong>Viewer</strong>. You have read-only access and cannot create or delete posts.
            </div>
          )}

          {/* Posts List */}
          <h3>Community Feed ({posts.length})</h3>
          {posts.map((post) => (
            <div key={post.id} style={styles.postCard}>
              <div style={styles.postHeader}>
                <h4 style={{ margin: 0 }}>{post.title}</h4>
                <small style={{ color: '#888' }}>By: {post.author}</small>
              </div>
              <p style={{ margin: '10px 0' }}>{post.content}</p>

              {/* Delete Button (ADMIN ONLY) */}
              {role === 'Admin' && (
                <button 
                  onClick={() => handleDeletePost(post.id)} 
                  style={styles.deleteBtn}
                >
                  🗑️ Delete Post (Admin)
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: LIVE JWT TOKEN INSPECTOR */}
      {activeTab === 'token' && (
        <div>
          <h3>Raw Encoded JWT Token</h3>
          <p style={{ fontSize: '13px', color: '#666' }}>Stored in <code>localStorage</code> under <code>jwt_auth_token</code>:</p>
          <div style={styles.tokenBox}>
            {token}
          </div>

          <h3>Decoded Payload Claims</h3>
          <p style={{ fontSize: '13px', color: '#666' }}>Parsed on client-side using <code>jwtDecode()</code>:</p>
          <pre style={styles.jsonBox}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}

      <hr style={{ margin: '30px 0 15px 0' }} />

      {/* Route Quick Links */}
      <div style={styles.routeLinks}>
        <strong>Test Protected Routes:</strong>
        <Link to="/viewer-page" style={styles.link}>Viewer Area</Link>
        <Link to="/editor-page" style={styles.link}>Editor Area</Link>
        <Link to="/admin-page" style={styles.link}>Admin Panel</Link>
      </div>

      <button onClick={handleLogoutClick} style={styles.logoutBtn}>Logout & Clear Session</button>
    </div>
  );
};

const styles = {
  container: { maxWidth: '700px', margin: '20px auto', padding: '24px', fontFamily: 'Arial, sans-serif' },
  headerBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #e9ecef' },
  roleBadge: (role) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '13px',
    color: '#fff',
    background: role === 'Admin' ? '#dc3545' : role === 'Editor' ? '#ffc107' : '#17a2b8'
  }),
  tabs: { display: 'flex', gap: '10px', margin: '20px 0' },
  tabBtn: { padding: '10px 16px', background: '#e9ecef', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  activeTabBtn: { padding: '10px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  card: { background: '#fdfdfd', border: '1px solid #ddd', padding: '16px', borderRadius: '8px', marginBottom: '20px' },
  field: { marginBottom: '10px' },
  input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  addBtn: { background: '#28a745', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  readOnlyNotice: { background: '#e2f0d9', color: '#2b542c', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' },
  postCard: { background: '#fff', border: '1px solid #eee', padding: '16px', borderRadius: '8px', marginBottom: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  postHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  deleteBtn: { background: '#dc3545', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginTop: '8px' },
  tokenBox: { background: '#272822', color: '#f8f8f2', padding: '12px', borderRadius: '6px', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '12px' },
  jsonBox: { background: '#f4f4f4', padding: '12px', borderRadius: '6px', fontSize: '13px' },
  routeLinks: { display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', marginBottom: '20px' },
  link: { color: '#007bff', textDecoration: 'none' },
  logoutBtn: { width: '100%', background: '#6c757d', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }
};

export default Dashboard;