import { LineChart } from "@mui/x-charts/LineChart";
import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

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

  return <div></div>;
}

export default MoodGraph;
