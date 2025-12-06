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
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const { getToken } = useAuth();

  useEffect(() => {
    const getTodayCheckIn = async () => {
      const token = await getToken({ template: "backend" });
      const todaysDate = new Date().toLocaleDateString("en-CA"); // "2025-12-02"
      const response = await fetch(
        `http://127.0.0.1:8000/check_in/${todaysDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setHasCheckedIn(true);
      }
      if (response.status === 404) {
        setHasCheckedIn(false);
      }
    };
    getTodayCheckIn();
  }, [getToken]);

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
