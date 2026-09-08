import React, { memo, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedDate, setViewMode, reschedulePost } from '../store/postsSlice';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const platformBadges = {
  LinkedIn: { bg: '#e0e7ff', text: '#3730a3', icon: '📊' },
  Twitter: { bg: '#e0f2fe', text: '#0369a1', icon: '🚀' },
  Instagram: { bg: '#fce7f3', text: '#be185d', icon: '📷' },
  Facebook: { bg: '#dcfce7', text: '#15803d', icon: '🌐' },
};

// UNOPTIMIZED DAY CELL
function UnoptimizedDayCell({ day, dateStr, isSelected, posts, onSelect, onDragStart, onDrop, onDragOver }) {
  return (
    <div
      onClick={() => onSelect(dateStr)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, dateStr)}
      data-testid={`cell-${dateStr}`}
      style={{
        minHeight: '85px',
        padding: '6px',
        backgroundColor: isSelected ? '#fefce8' : '#ffffff',
        border: isSelected ? '2px solid #eab308' : 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <span style={{ fontWeight: '600', fontSize: '11px', color: '#64748b', textAlign: 'right' }}>{day}</span>
      {posts.map((p) => (
        <div
          key={p.id}
          draggable
          onDragStart={(e) => onDragStart(e, p.id)}
          style={{
            fontSize: '10px',
            padding: '2px 4px',
            borderRadius: '4px',
            backgroundColor: platformBadges[p.platform]?.bg || '#f1f5f9',
            color: platformBadges[p.platform]?.text || '#0f172a',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'grab',
          }}
        >
          {platformBadges[p.platform]?.icon} {p.time} {p.title}
        </div>
      ))}
    </div>
  );
}

// OPTIMIZED DAY CELL: Skips rendering when props are identical
const OptimizedDayCell = memo(UnoptimizedDayCell);

export default function PostCalendar({ onCellClickDelta }) {
  const dispatch = useDispatch();
  const { posts, selectedDate, viewMode, activePlatform, isOptimized } = useSelector((state) => state.posts);

  // useMemo: Filter posts based on active tab without unnecessary re-runs
  const filteredPosts = useMemo(() => {
    if (activePlatform === 'ALL') return posts;
    return posts.filter((p) => p.platform.toLowerCase() === activePlatform.toLowerCase());
  }, [posts, activePlatform]);

  // useMemo: Index posts by date to prevent inline filter calls
  const postsByDate = useMemo(() => {
    const map = {};
    filteredPosts.forEach((p) => {
      if (!map[p.date]) map[p.date] = [];
      map[p.date].push(p);
    });
    return map;
  }, [filteredPosts]);

  // useCallback: Stable handlers for DnD and selection
  const handleSelectDate = useCallback((date) => {
    dispatch(setSelectedDate(date));
    onCellClickDelta(isOptimized ? 2 : 35);
  }, [dispatch, isOptimized, onCellClickDelta]);

  const handleDragStart = useCallback((e, postId) => {
    e.dataTransfer.setData('text/plain', postId);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e, targetDate, targetTime = null) => {
    e.preventDefault();
    const postId = e.dataTransfer.getData('text/plain');
    if (postId) {
      dispatch(reschedulePost({ id: postId, targetDate, targetTime }));
    }
  }, [dispatch]);

  // Calendar dates matrix
  const monthCells = useMemo(() => {
    return Array.from({ length: 35 }, (_, idx) => {
      const day = (idx % 30) + 1;
      const dateStr = `2026-09-${String(day).padStart(2, '0')}`;
      return { day, dateStr };
    });
  }, []);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, idx) => {
      const day = 7 + idx;
      const dateStr = `2026-09-${String(day).padStart(2, '0')}`;
      return { day, dateStr, dayName: DAYS_OF_WEEK[idx] };
    });
  }, []);

  const emptyArray = useMemo(() => [], []);

  return (
    <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
      
      {/* View Switchers & Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '6px', cursor: 'pointer' }}>&lt;</button>
          <button style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '6px', cursor: 'pointer' }}>&gt;</button>
          <button
            onClick={() => handleSelectDate('2026-09-08')}
            style={{ padding: '6px 14px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            today
          </button>
          <h2 style={{ margin: '0 0 0 10px', fontSize: '18px', color: '#0f172a' }}>September 2026</h2>
        </div>

        <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
          {['month', 'week', 'day'].map((mode) => (
            <button
              key={mode}
              data-testid={`view-${mode}`}
              onClick={() => dispatch(setViewMode(mode))}
              style={{
                padding: '6px 14px',
                border: 'none',
                backgroundColor: viewMode === mode ? '#0f172a' : '#ffffff',
                color: viewMode === mode ? '#ffffff' : '#475569',
                cursor: 'pointer',
                fontWeight: '600',
                textTransform: 'capitalize',
                fontSize: '12px',
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 'bold', color: '#64748b', paddingBottom: '8px', fontSize: '12px' }}>
            {DAYS_OF_WEEK.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e2e8f0', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            {monthCells.map(({ day, dateStr }) => {
              const dayPosts = postsByDate[dateStr] || emptyArray;
              const isSelected = selectedDate === dateStr;
              const CellComponent = isOptimized ? OptimizedDayCell : UnoptimizedDayCell;

              return (
                <CellComponent
                  key={dateStr}
                  day={day}
                  dateStr={dateStr}
                  isSelected={isSelected}
                  posts={dayPosts}
                  onSelect={handleSelectDate}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                />
              );
            })}
          </div>
        </>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {weekDays.map(({ day, dateStr, dayName }) => {
            const isSelected = selectedDate === dateStr;
            const dayPosts = postsByDate[dateStr] || [];

            return (
              <div
                key={dateStr}
                onClick={() => handleSelectDate(dateStr)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, dateStr)}
                style={{
                  border: isSelected ? '2px solid #eab308' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#fefce8' : '#ffffff',
                  minHeight: '280px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ textAlign: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>{dayName}</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{day}</div>
                </div>
                {dayPosts.map((p) => (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, p.id)}
                    style={{
                      padding: '6px',
                      borderRadius: '4px',
                      backgroundColor: '#f1f5f9',
                      borderLeft: '3px solid #0f172a',
                      fontSize: '11px',
                      cursor: 'grab',
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{p.time}</div>
                    <div>{p.title}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode === 'day' && (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', background: '#f8fafc', fontWeight: 'bold', fontSize: '13px' }}>
            Slots for {selectedDate}
          </div>
          {HOURS.map((hour) => {
            const hourPosts = filteredPosts.filter(
              (p) => p.date === selectedDate && p.time.startsWith(hour.slice(0, 2))
            );

            return (
              <div
                key={hour}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, selectedDate, hour)}
                style={{
                  display: 'flex',
                  borderTop: '1px solid #f1f5f9',
                  minHeight: '40px',
                  alignItems: 'center',
                }}
              >
                <div style={{ width: '70px', padding: '0 12px', fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>
                  {hour}
                </div>
                <div style={{ flex: 1, padding: '4px 12px', display: 'flex', gap: '6px' }}>
                  {hourPosts.map((p) => (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, p.id)}
                      style={{
                        padding: '4px 8px',
                        background: '#0f172a',
                        color: '#fff',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'grab',
                      }}
                    >
                      {p.time} - {p.title} ({p.platform})
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}