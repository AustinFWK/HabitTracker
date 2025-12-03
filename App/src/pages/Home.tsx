import Calendar from "../components/Calendar";
import DailyCheckInForm from "../components/DailyCheckInForm";
import MoodGraph from "../components/MoodGraph";
import { useState } from "react";
import { Button } from "@mui/material";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  const { getToken } = useAuth();

  useEffect(() => {
    const getTodayCheckIn = async () => {
      const token = await getToken({ template: "backend" });
      const todaysDate = new Date().toISOString().split("T")[0]; // "2025-12-02"
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
      <h1>Home</h1>
      <p>Welcome to the Home page!</p>
      <Button
        variant="contained"
        size="large"
        onClick={() => setIsModalOpen(true)}
      >
        Log your day!
      </Button>
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
