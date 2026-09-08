export function calculateSchedulingFeasibility(targetStartISO, existingPosts, excludePostId = null) {
  if (!targetStartISO) {
    return { score: 100, status: 'Optimal', reason: 'Pick a date and time slot.', color: '#10b981' };
  }

  const targetTime = new Date(targetStartISO).getTime();
  const targetDateStr = targetStartISO.slice(0, 10);
  const relevantPosts = existingPosts.filter((p) => p.id !== excludePostId);

  // 1. Direct collision within 30 minutes
  const collision = relevantPosts.some((p) => {
    const postTime = new Date(p.start).getTime();
    return Math.abs(postTime - targetTime) < 30 * 60 * 1000;
  });

  if (collision) {
    return {
      score: 15,
      status: 'High Conflict',
      reason: 'Direct collision with an existing scheduled post in this time window.',
      color: '#ef4444',
    };
  }

  // 2. Buffer window proximity (< 2 hours)
  const hasCloseBuffer = relevantPosts.some((p) => {
    const postTime = new Date(p.start).getTime();
    return Math.abs(postTime - targetTime) / (1000 * 60 * 60) < 2;
  });

  // 3. Daily load check
  const dailyCount = relevantPosts.filter((p) => p.start.slice(0, 10) === targetDateStr).length;

  if (dailyCount >= 3) {
    return {
      score: 45,
      status: 'High Load',
      reason: `Heavy posting volume (${dailyCount} posts already scheduled on this date).`,
      color: '#f59e0b',
    };
  }

  if (hasCloseBuffer) {
    return {
      score: 75,
      status: 'Tight Buffer',
      reason: 'Slot is within 2 hours of another post. Feasible with minimal gap.',
      color: '#3b82f6',
    };
  }

  return {
    score: 98,
    status: 'Optimal Slot',
    reason: 'Zero overlap and balanced schedule spacing.',
    color: '#10b981',
  };
}