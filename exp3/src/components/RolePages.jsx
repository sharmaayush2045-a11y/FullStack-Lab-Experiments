import React from 'react';
import { Link } from 'react-router-dom';

const pageStyle = {
  maxWidth: '500px',
  margin: '40px auto',
  padding: '24px',
  border: '2px solid #ccc',
  borderRadius: '8px',
  textAlign: 'center'
};

export const ViewerPage = () => (
  <div style={pageStyle}>
    <h2>Viewer Portal</h2>
    <p>Public / Read-only content accessible by Viewer, Editor, and Admin.</p>
    <Link to="/dashboard">Back to Dashboard</Link>
  </div>
);

export const EditorPage = () => (
  <div style={pageStyle}>
    <h2>Editor Portal</h2>
    <p>Content management portal accessible only by Editors and Admins.</p>
    <Link to="/dashboard">Back to Dashboard</Link>
  </div>
);

export const AdminPage = () => (
  <div style={pageStyle}>
    <h2>Admin Control Panel</h2>
    <p>Restricted system administration controls accessible strictly by Admins.</p>
    <Link to="/dashboard">Back to Dashboard</Link>
  </div>
);

export const Unauthorized = () => (
  <div style={{ ...pageStyle, borderColor: 'red' }}>
    <h2 style={{ color: 'red' }}>403 - Access Denied</h2>
    <p>You do not have the required permissions/role to view this route.</p>
    <Link to="/dashboard">Return to Dashboard</Link>
  </div>
);