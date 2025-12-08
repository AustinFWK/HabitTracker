import Calendar from "../components/Calendar";
import DailyCheckInForm from "../components/DailyCheckInForm";
import MoodGraph from "../components/MoodGraph";
import StreakTracker from "../components/StreakTracker";
import StatusBadge from "../components/StatusBadge";
import { useState } from "react";
import { Typography, Box, Container, Fab, Zoom } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkInApi } from "../../../api/app/api/services/checkInService";
import { setAuthTokenGetter } from "../../../api/app/axios/axiosInstance";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(() =>
      getToken({
        template: "backend",
      })
    );
  }, [getToken]);

  const todaysDate = new Date().toLocaleDateString("en-CA"); // Format: YYYY-MM-DD

  const { data: todayCheckIn } = useQuery({
    queryKey: ["checkIn", todaysDate],
    queryFn: () => checkInApi.getByDate(todaysDate),
    retry: false,
  });

  const hasCheckedIn = !!todayCheckIn;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #feca57 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            mb: 4,
            animation: "fadeInDown 0.6s ease-out",
            "@keyframes fadeInDown": {
              from: {
                opacity: 0,
                transform: "translateY(-20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"DM Serif Display", serif',
              fontWeight: 700,
              color: "white",
              mb: 1,
              textShadow: "0 4px 20px rgba(0,0,0,0.3)",
              letterSpacing: "-0.02em",
            }}
          >
            Good{" "}
            {new Date().getHours() < 12
              ? "Morning"
              : new Date().getHours() < 18
              ? "Afternoon"
              : "Evening"}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            {hasCheckedIn ? "You're on track today" : "Ready to log your day?"}
          </Typography>
        </Box>

        {/* Streak Tracker - Hero Element */}
        <Box
          sx={{
            animation: "fadeInUp 0.6s ease-out 0.2s backwards",
            "@keyframes fadeInUp": {
              from: {
                opacity: 0,
                transform: "translateY(20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <StreakTracker />
        </Box>

        {/* Status Badge */}
        <StatusBadge hasCheckedIn={hasCheckedIn} />

        {/* Data Visualization Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            animation: "fadeInUp 0.6s ease-out 0.6s backwards",
          }}
        >
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              p: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 25px 70px rgba(0,0,0,0.2)",
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"DM Serif Display", serif',
                mb: 2,
                color: "#1a202c",
              }}
            >
              Your Calendar
            </Typography>
            <Calendar />
          </Box>

          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              p: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 25px 70px rgba(0,0,0,0.2)",
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"DM Serif Display", serif',
                mb: 2,
                color: "#1a202c",
              }}
            >
              Mood Trends
            </Typography>
            <MoodGraph />
          </Box>
        </Box>

        {/* Floating Action Button */}
        {!hasCheckedIn && (
          <Zoom in={!hasCheckedIn}>
            <Fab
              color="primary"
              aria-label="log your day"
              onClick={() => setIsModalOpen(true)}
              sx={{
                position: "fixed",
                bottom: 32,
                right: 32,
                width: 72,
                height: 72,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  transform: "scale(1.1) rotate(90deg)",
                  boxShadow: "0 16px 50px rgba(102, 126, 234, 0.5)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <AddIcon sx={{ fontSize: 32 }} />
            </Fab>
          </Zoom>
        )}

        <DailyCheckInForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Container>
    </Box>
  );
}

export default Home;
