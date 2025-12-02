import Calendar from "../components/Calendar";
import DailyCheckInForm from "../components/DailyCheckInForm";
import MoodGraph from "../components/MoodGraph";
import { useState } from "react";
import { Button } from "@mui/material";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
