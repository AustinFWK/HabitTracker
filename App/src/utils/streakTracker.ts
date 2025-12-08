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
  const sortedDates = checkIns
    .map((checkIns) => dayjs(checkIns.date))
    .sort((a, b) => a.valueOf() - b.valueOf());

  const today = dayjs().startOf("day");
  const lastCheckin = sortedDates[sortedDates.length - 1];
  const isOngoingToday = lastCheckin.isSame(today, "day");

  const daysSinceLastCheckIn = today.diff(lastCheckin, "day");
  const hasActiveStreak = daysSinceLastCheckIn <= 1;

  let currentStreak = 0;
  let streakStartDate: string | null = null;

  if (hasActiveStreak) {
    currentStreak = 1;
    streakStartDate = lastCheckin.format("YYYY-MM-DD");
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const currentDate = sortedDates[i];
      const nextDate = sortedDates[i + 1];

      if (nextDate.diff(currentDate, "day") === 1) {
        currentStreak += 1;
        streakStartDate = currentDate.format("YYYY-MM-DD");
      } else {
        break;
      }
    }
  }

  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const previousDate = sortedDates[i - 1];
    const currentDate = sortedDates[i];

    if (currentDate.diff(previousDate, "day") === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, 1);
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
