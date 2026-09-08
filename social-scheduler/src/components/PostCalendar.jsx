import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import {
  addPost,
  updatePost,
  reschedulePost,
  deletePost,
  setPlatformFilter,
} from '../store/postsSlice';
import { selectFilteredPosts, selectPlatformMetrics } from '../store/postsSelectors';
import { analyzeDateOptimization } from '../utils/aiProbabilityEngine';

import PlatformFilter from './PlatformFilter';
import PostModal from './PostModal';
import AIOptimizationSidebar from './AIOptimizationSidebar';

export default function PostCalendar() {
  const dispatch = useDispatch();

  const allPosts = useSelector((state) => state.posts.items);
  const filteredPosts = useSelector(selectFilteredPosts);
  const metrics = useSelector(selectPlatformMetrics);
  const activePlatform = useSelector((state) => state.posts.activePlatform || 'ALL');

  // Track the focused date for the AI Inspector
  const [inspectedDate, setInspectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Derive live AI Probability Analysis for the selected calendar date
  const aiAnalysis = useMemo(() => {
    return analyzeDateOptimization(inspectedDate, allPosts);
  }, [inspectedDate, allPosts]);

  const handleSelectPlatform = useCallback((platform) => {
    dispatch(setPlatformFilter(platform));
  }, [dispatch]);

  // Click on date slot: updates the inspector and opens modal
  const handleDateSelect = useCallback((selectInfo) => {
    const clickedDate = selectInfo.startStr.slice(0, 10);
    setInspectedDate(clickedDate);
    setSelectedPost({ start: selectInfo.startStr });
    setModalOpen(true);
  }, []);

  // Click on a date cell without triggering full modal immediately
  const handleDateClick = useCallback((dateClickInfo) => {
    setInspectedDate(dateClickInfo.dateStr.slice(0, 10));
  }, []);

  const handleEventClick = useCallback((clickInfo) => {
    const eventDate = clickInfo.event.startStr.slice(0, 10);
    setInspectedDate(eventDate);
    setSelectedPost({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      platform: clickInfo.event.extendedProps?.platform || 'Twitter',
      content: clickInfo.event.extendedProps?.content || '',
      backgroundColor: clickInfo.event.backgroundColor,
    });
    setModalOpen(true);
  }, []);

  const handleEventDrop = useCallback((dropInfo) => {
    const updatedDate = dropInfo.event.start.toISOString().slice(0, 10);
    setInspectedDate(updatedDate);
    dispatch(
      reschedulePost({
        id: dropInfo.event.id,
        newStart: dropInfo.event.start.toISOString(),
        newEnd: dropInfo.event.end ? dropInfo.event.end.toISOString() : null,
      })
    );
  }, [dispatch]);

  const handleSavePost = useCallback((formData) => {
    if (selectedPost?.id) {
      dispatch(updatePost({ ...formData, id: selectedPost.id }));
    } else {
      dispatch(addPost({ ...formData, id: Date.now().toString() }));
    }
    setModalOpen(false);
    setSelectedPost(null);
  }, [dispatch, selectedPost]);

  const handleDeletePost = useCallback((id) => {
    dispatch(deletePost(id));
    setModalOpen(false);
    setSelectedPost(null);
  }, [dispatch]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedPost(null);
  }, []);

  const handleQuickScheduleFromAI = useCallback((dateStr) => {
    setSelectedPost({ start: `${dateStr}T10:00:00` });
    setModalOpen(true);
  }, []);

  const headerToolbar = useMemo(() => ({
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  }), []);

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '16px' }}>
        <h2 style={{ margin: 0, color: '#0f172a' }}>Social Media Post Scheduler</h2>
        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
          Select any date to view real-time AI scheduling feasibility and optimal traffic windows.
        </p>
      </header>

      <PlatformFilter
        activePlatform={activePlatform}
        onSelectPlatform={handleSelectPlatform}
        metrics={metrics}
      />

      {/* Side-by-Side Flexbox Layout */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {/* Main Calendar Interface */}
        <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={headerToolbar}
            selectable={true}
            editable={true}
            events={filteredPosts}
            select={handleDateSelect}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventDrop}
            height="auto"
          />
        </div>

        {/* AI Insight & Optimization Inspector Panel */}
        <AIOptimizationSidebar
          analysis={aiAnalysis}
          onQuickSchedule={handleQuickScheduleFromAI}
        />
      </div>

      <PostModal
        isOpen={modalOpen}
        initialData={selectedPost}
        onClose={handleCloseModal}
        onSave={handleSavePost}
        onDelete={handleDeletePost}
      />
    </div>
  );
}