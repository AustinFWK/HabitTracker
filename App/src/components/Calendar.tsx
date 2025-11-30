import { useState } from "react";
import { Dayjs } from "dayjs";
import { useAuth } from "@clerk/clerk-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface CheckInData {
  entry: string;
  mood_scale: number;
  ai_feedback?: string;
  date: string;
  mood_id: number;
  entry_id: number;
}

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [checkInData, setCheckInData] = useState<CheckInData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { getToken } = useAuth();

  const handleDateChange = async (date: Dayjs | null) => {
    if (!date) return;

    setSelectedDate(date);
    setIsLoading(true);
    setError("");
    setIsDialogOpen(true);

    const formattedDate = date.format("YYYY-MM-DD");

    try {
        const token = await getToken({ template: "backend" });

        const response = await fetch(
            `http://localhost:5173/check_in/${formattedDate}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to fetch check-in data");
        }
                }
  };
}
