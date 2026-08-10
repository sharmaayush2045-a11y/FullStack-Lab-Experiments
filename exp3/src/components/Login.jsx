import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMockJWT, setToken } from '../utils/jwtHelper';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('student@cu.ac.in');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState('Viewer');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === '123456') {
      const userPayload = {
        id: 'USR-8821',
        name: 'Ayush Sharma',
        email: email,
        role: role
      };

      const token = generateMockJWT(userPayload);
      setToken(token);
      onLoginSuccess(token);
      navigate('/dashboard');
    } else {
      alert('Invalid password! Use 123456');
    }
  };

  return (
    <div style={styles.card}>
      <h2>RBAC Authentication System</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div style={styles.field}>
          <label>Password (123456)</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div style={styles.field}>
          <label><strong>Select Role to Simulate RBAC:</strong></label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
            <option value="Viewer">Viewer (Read-Only Access)</option>
            <option value="Editor">Editor (Read + Write Access)</option>
            <option value="Admin">Admin (Full System Access)</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>Login as {role}</button>
      </form>
    </div>
  );
};

const styles = {
  card: { maxWidth: '400px', margin: '40px auto', padding: '24px', border: '1px solid #ccc', borderRadius: '8px' },
  field: { marginBottom: '16px', display: 'flex', flexDirection: 'column' },
  select: { padding: '8px', marginTop: '4px' },
  button: { width: '100%', padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Login;