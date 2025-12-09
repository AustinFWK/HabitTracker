import DailyCheckInForm from "../components/DailyCheckInForm";
import StreakTracker from "../components/StreakTracker";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import DataVisualizationGrid from "../components/DataVisualizationGrid";
import { useState } from "react";
import { Box, Container } from "@mui/material";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkInApi } from "../../../api/app/api/services/checkInService";
import { setAuthTokenGetter } from "../../../api/app/axios/axiosInstance";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getToken } = useAuth();

  //automatically fetches most current JWT for API calls
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
        width: "100%",
        background:
          "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 25%, #c44569 50%, #f39c12 75%, #f8b739 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <PageHeader hasCheckedIn={hasCheckedIn} />

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
          <StreakTracker
            hasCheckedIn={hasCheckedIn}
            onOpenCheckIn={() => setIsModalOpen(true)}
          />
        </Box>

        {/* Status Badge */}
        <StatusBadge hasCheckedIn={hasCheckedIn} />

        {/* Data Visualization Grid */}
        <DataVisualizationGrid />

        <DailyCheckInForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Container>
    </Box>
  );
}

export default Home;
