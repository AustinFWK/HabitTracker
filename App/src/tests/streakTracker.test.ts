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

  it("should calculate a 2-day streak ending today", () => {
    // create dates for today and yesterday
    const today = dayjs().startOf("day").format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    // Arrange check-ins for yesterday and today
    const checkIns = [createCheckIn(yesterday), createCheckIn(today)];

    // Act
    const result = calculateStreakStats(checkIns);

    // Assert
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(2);
    expect(result.totalCheckIns).toBe(2);
    expect(result.lastCheckInDate).toBe(today);
    expect(result.streakStartDate).toBe(yesterday);
    expect(result.isOngoingToday).toBe(true);
  });

  it("should track longest streak correctly when current streak is shorter", () => {
    // Create entries for 3 day streak
    const sevenDaysAgo = dayjs().subtract(7, "day").format("YYYY-MM-DD");
    const sixDaysAgo = dayjs().subtract(6, "day").format("YYYY-MM-DD");
    const fiveDaysAgo = dayjs().subtract(5, "day").format("YYYY-MM-DD");

    // create entry for today to begin new streak
    const today = dayjs().startOf("day").format("YYYY-MM-DD");

    // Arrange check-ins for a past 3-day streak and a new streak starting today
    const checkIns = [
      createCheckIn(sevenDaysAgo),
      createCheckIn(sixDaysAgo),
      createCheckIn(fiveDaysAgo),
      createCheckIn(today),
    ];

    // Act
    const result = calculateStreakStats(checkIns);

    // Assert
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(3);
    expect(result.totalCheckIns).toBe(4);
    expect(result.lastCheckInDate).toBe(today);
    expect(result.streakStartDate).toBe(today);
    expect(result.isOngoingToday).toBe(true);
  });

  it("should continue streak if last check-in was yesterday", () => {
    // create dates for yesterday and the day before
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    const twoDaysAgo = dayjs().subtract(2, "day").format("YYYY-MM-DD");

    // Arrange check-ins for the day before yesterday and yesterday
    const checkIns = [createCheckIn(twoDaysAgo), createCheckIn(yesterday)];

    // Act
    const result = calculateStreakStats(checkIns);

    // Assert
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(2);
    expect(result.totalCheckIns).toBe(2);
    expect(result.lastCheckInDate).toBe(yesterday);
    expect(result.streakStartDate).toBe(twoDaysAgo);
    expect(result.isOngoingToday).toBe(false);
  });
});
