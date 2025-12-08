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
}
