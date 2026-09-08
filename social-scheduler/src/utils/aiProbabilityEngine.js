/**
 * AI Probability & Slot Optimization Engine
 * Calculates multi-variable scheduling feasibility and best alternate slots.
 */
export function analyzeDateOptimization(targetDateStr, posts) {
  if (!targetDateStr) {
    targetDateStr = new Date().toISOString().slice(0, 10);
  }

  const selectedDate = targetDateStr.slice(0, 10);
  const postsOnDate = posts.filter((p) => p.start.slice(0, 10) === selectedDate);
  const postCount = postsOnDate.length;

  // 1. Calculate Density Score (0 - 100)
  let densityScore = 100;
  if (postCount === 1) densityScore = 85;
  else if (postCount === 2) densityScore = 65;
  else if (postCount === 3) densityScore = 40;
  else if (postCount >= 4) densityScore = 15;

  // 2. Audience Engagement Multiplier (Mock peak engagement periods)
  const dayOfWeek = new Date(selectedDate).getDay(); // 0 = Sun, 6 = Sat
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const audienceFactor = isWeekend ? 70 : 92; // Higher engagement on weekdays

  // 3. Composite Feasibility Probability
  const overallProbability = Math.round(densityScore * 0.65 + audienceFactor * 0.35);

  // 4. Status, Color, and AI Recommendations
  let status = 'High Success Rate';
  let badgeColor = '#10b981'; // Green
  let aiAdvice = 'This date has low congestion and optimal audience visibility. Recommended for high-priority campaigns.';

  if (overallProbability < 45) {
    status = 'Over-saturated';
    badgeColor = '#ef4444'; // Red
    aiAdvice = 'High post frequency detected. Adding another post risks audience fatigue and cannibalized reach.';
  } else if (overallProbability < 75) {
    status = 'Moderate Load';
    badgeColor = '#f59e0b'; // Amber
    aiAdvice = 'Moderate activity. Space out this post by at least 3 hours from existing content to avoid overlap.';
  }

  // 5. Calculate Smart Alternate Recommendations
  const primeSlots = ['09:00 AM', '01:30 PM', '06:00 PM'];
  const recommendedSlots = primeSlots.map((slot) => ({
    time: slot,
    status: postCount > 2 ? 'Tight Buffer' : 'Optimal Window',
  }));

  return {
    selectedDate,
    postCount,
    overallProbability,
    status,
    badgeColor,
    aiAdvice,
    recommendedSlots,
    postsOnDate,
  };
}