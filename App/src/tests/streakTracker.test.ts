import { describe, it, expect } from "vitest";
import { calculateStreakStats } from "../utils/streakTracker";
import type { StreakStats } from "../utils/streakTracker";
import type { CheckInData } from "../../../api/app/api/services/checkInService";
import dayjs from "dayjs";

// Helper function to create mock check-in data
const createCheckIn = (dateString: string): CheckInData => ({
  date: dateString,
  entry: "test entry",
  mood_scale: 3,
  mood_id: 1,
  entry_id: 1,
});

describe("calculateStreakStats", () => {
  it("should return zeroed stats for empty check-ins", () => {
    // Arrange an empty array of check-ins
    const emptyArray: CheckInData[] = [];

    // Act
    const result = calculateStreakStats(emptyArray);

    // Assert
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
    expect(result.totalCheckIns).toBe(0);
    expect(result.lastCheckInDate).toBe(null);
    expect(result.streakStartDate).toBe(null);
    expect(result.isOngoingToday).toBe(false);
  });

  it("should handle a single check-in from today", () => {
    // create today's date
    const today = dayjs().startOf("day").format("YYYY-MM-DD");

    // Arrange a single check-in for today
    const checkIns = [createCheckIn(today)];

    // Act
    const result = calculateStreakStats(checkIns);

    // Assert
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
    expect(result.totalCheckIns).toBe(1);
    expect(result.lastCheckInDate).toBe(today);
    expect(result.streakStartDate).toBe(today);
    expect(result.isOngoingToday).toBe(true);
  });

  it("should have no active streak if last check-in was 2 days ago", () => {
    // Arrange check-ins with the last one being 3 days ago
    const twoDaysAgo = dayjs().subtract(2, "day").format("YYYY-MM-DD");

    // Arrange a single check-in for three days ago
    const checkIns = [createCheckIn(twoDaysAgo)];

    // Act
    const result = calculateStreakStats(checkIns);

    // Assert
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(1);
    expect(result.totalCheckIns).toBe(1);
    expect(result.lastCheckInDate).toBe(twoDaysAgo);
    expect(result.streakStartDate).toBe(null);
    expect(result.isOngoingToday).toBe(false);
  });

  it("should calculate a 2-day streak ending today", () => {});
});
