import React from 'react';

// React.memo prevents re-rendering this card if its props haven't changed!
const PostItem = React.memo(({ post, platform, onDelete, onStatusUpdate }) => {
  console.log(`🎨 [Rendered Component] PostItem ID: ${post.id}`);

  return (
    <div className="post-item">
      <div>
        <div className="post-title">{post.title}</div>
        <div className="post-meta">
          <span>
            Platform: <strong className="badge">{platform ? platform.name : 'Unknown'}</strong>
          </span>
          <span>
            Status:{' '}
            <select
              value={post.status}
              onChange={(e) => onStatusUpdate(post.id, e.target.value)}
              className="status-select"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </span>
        </div>
      </div>
      <button onClick={() => onDelete(post.id)} className="btn-delete">
        Delete
      </button>
    </div>
  );
});

export default PostItem;