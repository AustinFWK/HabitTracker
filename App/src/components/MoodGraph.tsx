import { LineChart } from "@mui/x-charts/LineChart";
import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

interface CheckInData {
  date: string;
  mood_scale: number;
  mood_id: number;
  entry: string;
  entry_id: number;
  ai_feedback?: string;
}

function MoodGraph() {
  const [checkIns, setCheckIns] = useState<CheckInData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCheckIns = async () => {
      setIsLoading(true);
      setError("");

      try {
        const token = await getToken({ template: "backend" });
        const response = await fetch("http://127.0.0.1:8000/check_in", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch check-ins");
        }

        const data = await response.json();
        setCheckIns(data);
      } catch {
        setError("Error fetching check-in data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCheckIns();
  }, []);

  const dates = checkIns.map((checkIn) => checkIn.date);
  const moods = checkIns.map((checkIn) => checkIn.mood_scale);

  return (
    <div>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ color: "red", textAlign: "center", padding: 3 }}>
          {error}
        </Box>
      ) : checkIns.length > 0 ? (
        <LineChart
          xAxis={[
            {
              data: dates,
              scaleType: "point",
            },
          ]}
          series={[
            {
              data: moods,
              label: "Mood Rating",
            },
          ]}
          width={600}
          height={300}
        />
      ) : (
        <Box sx={{ textAlign: "center", padding: 3 }}>
          No check-in data yet, start tracking your mood now!
        </Box>
      )}
    </div>
  );
}

export default MoodGraph;
