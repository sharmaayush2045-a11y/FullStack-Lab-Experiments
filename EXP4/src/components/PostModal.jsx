import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../store/postsSlice';

export default function PostModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const selectedDate = useSelector((state) => state.posts.selectedDate);

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('11:00');
  const [platform, setPlatform] = useState('LinkedIn');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    dispatch(addPost({ title, time, platform, date: selectedDate }));
    setTitle('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', width: '340px' }}>
        <h3 style={{ marginTop: 0 }}>Schedule Post</h3>
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '-8px' }}>Date: {selectedDate}</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Title</label>
            <input
              type="text"
              required
              data-testid="input-post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '6px', marginTop: '2px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ width: '100%', padding: '6px', marginTop: '2px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              style={{ width: '100%', padding: '6px', marginTop: '2px', boxSizing: 'border-box' }}
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="submit-post-btn"
              style={{ padding: '6px 12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}