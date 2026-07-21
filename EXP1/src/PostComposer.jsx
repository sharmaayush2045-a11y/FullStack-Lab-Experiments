import React, { useState, useMemo } from 'react';
import { PLATFORMS } from './platforms';
import './PostComposer.css';

export default function PostComposer() {
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter']);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Toggle platform selection
  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  // Compute strictest active constraints
  const activeConstraints = useMemo(() => {
    if (selectedPlatforms.length === 0) return { maxChars: Infinity, mediaRequired: false };

    return selectedPlatforms.reduce(
      (acc, pId) => {
        const config = PLATFORMS[pId];
        return {
          maxChars: Math.min(acc.maxChars, config.maxChars),
          mediaRequired: acc.mediaRequired || config.mediaRequired,
        };
      },
      { maxChars: Infinity, mediaRequired: false }
    );
  }, [selectedPlatforms]);

  const hashtagCount = (content.match(/#[^\s#]+/g) || []).length;
  const charCount = content.length;
  const remainingChars = activeConstraints.maxChars - charCount;

  // Validation rules engine
  const errors = [];
  const warnings = [];

  if (selectedPlatforms.length === 0) {
    errors.push("Select at least one platform to publish.");
  }
  if (charCount > activeConstraints.maxChars) {
    errors.push(`Content exceeds the character limit by ${Math.abs(remainingChars)} characters.`);
  }
  if (activeConstraints.mediaRequired && !media) {
    errors.push("Instagram requires at least one image attachment.");
  }
  if (remainingChars >= 0 && remainingChars <= 20 && activeConstraints.maxChars !== Infinity) {
    warnings.push(`Approaching character limit (${remainingChars} characters remaining).`);
  }

  // Button is enabled ONLY if there are no errors and text is entered
  const isValid = errors.length === 0 && content.trim().length > 0;

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(URL.createObjectURL(file));
    }
  };

  // 🚀 PUBLISH BUTTON HANDLER
  const handlePublish = () => {
    if (!isValid) return;

    // Show success message
    setIsSubmitted(true);

    // Clear form after 2 seconds
    setTimeout(() => {
      setContent('');
      setMedia(null);
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <div className="composer-card">
      <h2>Dynamic Post Composer</h2>

      {/* Platform Selector */}
      <div className="platform-selector">
        <label className="section-label">Target Platforms:</label>
        <div className="platform-chips">
          {Object.values(PLATFORMS).map((p) => {
            const isSelected = selectedPlatforms.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                className={`chip ${isSelected ? 'active' : ''}`}
                onClick={() => togglePlatform(p.id)}
                style={{ '--chip-color': p.color }}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Area Input */}
      <div className="input-group">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post here..."
          rows={5}
        />

        <div className="counter-bar">
          <span className="hashtag-count">Hashtags: {hashtagCount}</span>
          <span className={`char-counter ${remainingChars < 0 ? 'over-limit' : remainingChars <= 20 ? 'warning' : ''}`}>
            {charCount} / {activeConstraints.maxChars === Infinity ? '—' : activeConstraints.maxChars}
          </span>
        </div>
      </div>

      {/* Media Input */}
      <div className="media-section">
        <input type="file" accept="image/*" onChange={handleMediaUpload} id="media-input" hidden />
        <label htmlFor="media-input" className="upload-btn">
          📷 {media ? 'Change Attachment' : 'Attach Image'}
        </label>
        {media && (
          <div className="media-preview">
            <img src={media} alt="Preview" />
            <button type="button" onClick={() => setMedia(null)}>✕</button>
          </div>
        )}
      </div>

      {/* Feedback & Success Banners */}
      <div className="feedback-zone">
        {isSubmitted && (
          <div className="alert alert-success" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #86efac' }}>
            🎉 Post successfully published across selected platforms!
          </div>
        )}
        {errors.map((err, i) => (
          <div key={i} className="alert alert-error">⚠️ {err}</div>
        ))}
        {warnings.map((warn, i) => (
          <div key={i} className="alert alert-warning">💡 {warn}</div>
        ))}
      </div>

      {/* Action Button */}
      <div className="action-bar">
        <button 
          className="publish-btn" 
          disabled={!isValid} 
          onClick={handlePublish}
        >
          Publish Post
        </button>
      </div>
    </div>
  );
}