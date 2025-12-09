import dayjs from "dayjs";
import type { CheckInData } from "../../../api/app/api/services/checkInService";

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  lastCheckInDate: string | null;
  streakStartDate: string | null;
  isOngoingToday: boolean;
}

export function calculateStreakStats(checkIns: CheckInData[]): StreakStats {
  // Handle empty check-ins array by returning zeroed stats
  if (checkIns.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCheckIns: 0,
      lastCheckInDate: null,
      streakStartDate: null,
      isOngoingToday: false,
    };
  }

  // Convert all check-in dates to dayjs objects and sort chronologically (oldest to newest)
  const sortedDates = checkIns
    .map((checkIns) => dayjs(checkIns.date))
    .sort((a, b) => a.valueOf() - b.valueOf());

  // Get today's date (at start of day for accurate comparison) and the most recent check-in
  const today = dayjs().startOf("day");
  const lastCheckin = sortedDates[sortedDates.length - 1];
  const isOngoingToday = lastCheckin.isSame(today, "day");

  // Determine if the user has an active streak
  // A streak is active if the last check-in was today or yesterday (within 1 day)
  const daysSinceLastCheckIn = today.diff(lastCheckin, "day");
  const hasActiveStreak = daysSinceLastCheckIn <= 1;

  let currentStreak = 0;
  let streakStartDate: string | null = null;

  // Calculate the current active streak by walking backwards from the most recent check-in
  if (hasActiveStreak) {
    // Start with a streak of 1 (the most recent check-in)
    currentStreak = 1;
    streakStartDate = lastCheckin.format("YYYY-MM-DD");

    // Walk backwards through the sorted dates to count consecutive days
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const currentDate = sortedDates[i];
      const nextDate = sortedDates[i + 1];

      // Check if these dates are exactly 1 day apart (consecutive)
      if (nextDate.diff(currentDate, "day") === 1) {
        currentStreak += 1;
        streakStartDate = currentDate.format("YYYY-MM-DD");
      } else {
        // Break as soon as we find a gap - the streak is broken
        break;
      }
    }
  }

  // Calculate the longest streak ever achieved (may be in the past)
  let longestStreak = 0;
  let tempStreak = 1;

  // Walk forward through all dates to find the longest consecutive sequence
  for (let i = 1; i < sortedDates.length; i++) {
    const previousDate = sortedDates[i - 1];
    const currentDate = sortedDates[i];

    // If consecutive days, increment the temporary streak counter
    if (currentDate.diff(previousDate, "day") === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      // Gap found - reset the temporary streak counter
      tempStreak = 1;
    }
  }

  // Ensure longest streak is at least 1 (since we have at least 1 check-in)
  longestStreak = Math.max(longestStreak, 1);
  // Ensure longest streak includes the current streak if it's the longest
  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    totalCheckIns: checkIns.length,
    lastCheckInDate: lastCheckin.format("YYYY-MM-DD"),
    streakStartDate,
    isOngoingToday,
  };
}
