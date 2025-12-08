import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { checkInApi } from "../../../api/app/api/services/checkInService";
import { setAuthTokenGetter } from "../../../api/app/axios/axiosInstance";
import { calculateStreakStats } from "../utils/streakTracker";

interface StreakTrackerProps {
  hasCheckedIn: boolean;
  onOpenCheckIn: () => void;
}

function StreakTracker({ hasCheckedIn, onOpenCheckIn }: StreakTrackerProps) {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(() =>
      getToken({
        template: "backend",
      })
    );
  }, [getToken]);

  const {
    data: checkIns = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["checkIns"],
    queryFn: checkInApi.getAll,
  });

  const streakStats = calculateStreakStats(checkIns);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) {
    return null;
  }

  return (
    <Card
      sx={{
        mb: 4,
        background: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 50%, #4ECDC4 100%)",
        borderRadius: 6,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 20px 60px rgba(255, 107, 107, 0.3)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: "0 30px 80px rgba(255, 107, 107, 0.4)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <CardContent sx={{ p: 5, position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center" }}>
          {/* Decorative flame animation */}
          <Box
            sx={{
              fontSize: "5rem",
              mb: 2,
              display: "inline-block",
              animation: "flameFlicker 2s ease-in-out infinite",
              "@keyframes flameFlicker": {
                "0%, 100%": {
                  transform: "scale(1) rotate(-5deg)",
                  filter: "brightness(1)",
                },
                "50%": {
                  transform: "scale(1.1) rotate(5deg)",
                  filter: "brightness(1.2)",
                },
              },
            }}
          >
            {streakStats.currentStreak > 0 ? "🔥" : "✨"}
          </Box>

          {/* Streak Number */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: '"DM Serif Display", serif',
              fontWeight: 700,
              fontSize: "6rem",
              color: "white",
              lineHeight: 1,
              textShadow: "0 8px 30px rgba(0,0,0,0.3)",
              mb: 1,
              background: "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {streakStats.currentStreak}
          </Typography>

          {/* Day Label */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              color: "rgba(255,255,255,0.95)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              mb: 2,
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Day Streak
          </Typography>

          {/* Motivational Message */}
          <Box
            sx={{
              px: 4,
              py: 2,
              backgroundColor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                color: "white",
                fontSize: "1.1rem",
                textShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {streakStats.currentStreak === 0
                ? "🌱 Start your journey today!"
                : streakStats.currentStreak === 1
                ? "🎉 Amazing start! Keep it up!"
                : streakStats.currentStreak < 7
                ? "💪 Building momentum!"
                : streakStats.currentStreak < 30
                ? `🚀 Unstoppable! Started ${streakStats.streakStartDate}`
                : `⭐️ Legendary streak! ${streakStats.streakStartDate}`}
            </Typography>
          </Box>

          {/* Check-in Button - Only show if not checked in today */}
          {!hasCheckedIn && (
            <Button
              variant="contained"
              size="large"
              onClick={onOpenCheckIn}
              sx={{
                mt: 3,
                backgroundColor: "white",
                color: "#FF6B6B",
                fontSize: "1.1rem",
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
                py: 1.5,
                px: 5,
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.95)",
                  transform: "scale(1.03)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Log Your Day
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default StreakTracker;
