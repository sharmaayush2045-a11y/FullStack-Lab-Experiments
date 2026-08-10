// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { ViewerPage, EditorPage, AdminPage, Unauthorized } from './components/RolePages';
import { getToken } from './utils/jwtHelper';

function App() {
  const [token, setTokenState] = useState(null);

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) setTokenState(storedToken);
  }, []);

  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>
          Experiment 1.3.2: Role-Based Access Control (RBAC)
        </h1>

        <Routes>
          <Route 
            path="/login" 
            element={<Login onLoginSuccess={(t) => setTokenState(t)} />} 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Viewer', 'Editor', 'Admin']}>
                <Dashboard onLogout={() => setTokenState(null)} />
              </ProtectedRoute>
            } 
          />

          {/* Viewer Route: Accessible by All */}
          <Route 
            path="/viewer-page" 
            element={
              <ProtectedRoute allowedRoles={['Viewer', 'Editor', 'Admin']}>
                <ViewerPage />
              </ProtectedRoute>
            } 
          />

          {/* Editor Route: Accessible by Editor & Admin */}
          <Route 
            path="/editor-page" 
            element={
              <ProtectedRoute allowedRoles={['Editor', 'Admin']}>
                <EditorPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Route: Accessible ONLY by Admin */}
          <Route 
            path="/admin-page" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;