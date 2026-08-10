import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, decodeToken, removeToken } from '../utils/jwtHelper';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const token = getToken();
  const user = token ? decodeToken(token) : null;
  const role = user?.role || 'Guest';

  const handleLogoutClick = () => {
    removeToken();
    onLogout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h2>User Dashboard</h2>
      <div style={styles.badge}>
        Logged in as: <strong>{user?.name}</strong> | Role: <span style={styles.roleBadge}>{role}</span>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <h3>Navigation & Protected Routes</h3>
      <div style={styles.navLinks}>
        <Link to="/viewer-page" style={styles.link}>Viewer Area (All Roles)</Link>
        <Link to="/editor-page" style={styles.link}>Editor Area (Editor, Admin)</Link>
        <Link to="/admin-page" style={styles.link}>Admin Panel (Admin Only)</Link>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <h3>Dynamic UI Action Controls (Conditional Rendering)</h3>
      <p>Buttons shown below depend directly on your assigned role permissions:</p>

      <div style={styles.actionBox}>
        <button style={styles.btnView}>View Reports (All Roles)</button>

        {(role === 'Editor' || role === 'Admin') && (
          <button style={styles.btnEdit}>Edit Content (Editor & Admin)</button>
        )}

        {role === 'Admin' && (
          <button style={styles.btnDelete}>Delete System Logs (Admin Only)</button>
        )}
      </div>

      <br />
      <button onClick={handleLogoutClick} style={styles.logoutBtn}>Logout</button>
    </div>
  );
};

const styles = {
  container: { maxWidth: '650px', margin: '30px auto', padding: '24px', border: '1px solid #ddd', borderRadius: '8px' },
  badge: { background: '#f8f9fa', padding: '10px', borderRadius: '4px', display: 'inline-block' },
  roleBadge: { color: '#007bff', fontWeight: 'bold' },
  navLinks: { display: 'flex', gap: '15px', margin: '15px 0' },
  link: { padding: '8px 12px', background: '#e9ecef', color: '#333', textDecoration: 'none', borderRadius: '4px' },
  actionBox: { display: 'flex', gap: '10px', marginTop: '10px' },
  btnView: { padding: '10px', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px' },
  btnEdit: { padding: '10px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px' },
  btnDelete: { padding: '10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' },
  logoutBtn: { padding: '10px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Dashboard;