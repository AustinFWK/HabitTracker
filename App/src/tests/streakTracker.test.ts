import { describe, it, expect } from "vitest";
import { calculateStreakStats } from "../utils/streakTracker";
import type { StreakStats } from "../utils/streakTracker";
import type { CheckInData } from "../../../api/app/api/services/checkInService";

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
});
