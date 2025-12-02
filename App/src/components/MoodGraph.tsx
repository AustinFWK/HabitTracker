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
}
