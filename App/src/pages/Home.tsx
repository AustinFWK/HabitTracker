import Calendar from "../components/Calendar";
import DailyCheckInForm from "../components/DailyCheckInForm";
import MoodGraph from "../components/MoodGraph";
import { useState } from "react";
import { Button, Typography } from "@mui/material";
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
    <div>
      <Typography variant="h3" gutterBottom>
        Home
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome to the Home page!
      </Typography>
      {hasCheckedIn ? (
        <Typography variant="h6" color="success.main">
          Great job logging your habits today!
        </Typography>
      ) : (
        <Button
          variant="contained"
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          Log your day!
        </Button>
      )}
      <DailyCheckInForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Calendar />
      <MoodGraph />
    </div>
  );
}

export default Home;
