import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { X, Trash2 } from 'lucide-react';
import { calculateSchedulingFeasibility } from '../utils/schedulingMetrics';
import FeasibilityMeter from './FeasibilityMeter';

const PLATFORM_COLORS = {
  Twitter: '#1DA1F2',
  LinkedIn: '#0A66C2',
  Instagram: '#E1306C',
  Facebook: '#1877F2',
};

export default function PostModal({ isOpen, onClose, onSave, onDelete, initialData }) {
  const existingPosts = useSelector((state) => state.posts.items);

  const [formData, setFormData] = useState({
    title: '',
    platform: 'Twitter',
    content: '',
    start: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        platform: initialData.platform || 'Twitter',
        content: initialData.content || '',
        start: initialData.start ? initialData.start.slice(0, 16) : '',
      });
    }
  }, [initialData]);

  const feasibilityMetric = useMemo(() => {
    return calculateSchedulingFeasibility(formData.start, existingPosts, initialData?.id);
  }, [formData.start, existingPosts, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      backgroundColor: PLATFORM_COLORS[formData.platform] || '#2563eb',
    });
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, color: '#0f172a' }}>
            {initialData?.id ? 'Edit Scheduled Post' : 'Schedule New Post'}
          </h3>
          <button onClick={onClose} style={iconBtnStyle}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Post Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={inputStyle}
              placeholder="e.g., Weekly Tech Highlights"
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Platform</label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              style={inputStyle}
            >
              <option value="Twitter">Twitter / X</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Scheduled Date & Time</label>
            <input
              type="datetime-local"
              required
              value={formData.start}
              onChange={(e) => setFormData({ ...formData, start: e.target.value })}
              style={inputStyle}
            />
          </div>

          {formData.start && <FeasibilityMeter metric={feasibilityMetric} />}

          <div style={fieldStyle}>
            <label style={labelStyle}>Caption / Content</label>
            <textarea
              rows="3"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              style={inputStyle}
              placeholder="Write post content..."
            />
          </div>

          <div style={footerStyle}>
            {initialData?.id && (
              <button
                type="button"
                onClick={() => onDelete(initialData.id)}
                style={deleteBtnStyle}
              >
                <Trash2 size={16} /> Delete
              </button>
            )}
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              <button type="button" onClick={onClose} style={cancelBtnStyle}>
                Cancel
              </button>
              <button type="submit" style={submitBtnStyle}>
                Save Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { background: '#fff', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '480px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' };
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' };
const labelStyle = { fontSize: '13px', fontWeight: 600, color: '#334155' };
const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' };
const footerStyle = { display: 'flex', alignItems: 'center', marginTop: '16px' };
const iconBtnStyle = { border: 'none', background: 'none', cursor: 'pointer', padding: '4px' };
const submitBtnStyle = { background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 };
const cancelBtnStyle = { background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' };
const deleteBtnStyle = { display: 'flex', alignItems: 'center', gap: '4px', background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' };