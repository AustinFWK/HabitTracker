import { useState, useEffect } from "react";
import { Dayjs } from "dayjs";
import { useAuth } from "@clerk/clerk-react";
import { getMoodLabel } from "../utils/moods";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Typography,
  Badge,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { checkInApi } from "../../../api/app/api/services/checkInService";
import { setAuthTokenGetter } from "../../../api/app/axios/axiosInstance";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(() =>
      getToken({
        template: "backend",
      })
    );
  }, [getToken]);

  const formattedDate = selectedDate?.format("YYYY-MM-DD") || "";

  const {
    data: checkInData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["checkIn", formattedDate],
    queryFn: () => checkInApi.getByDate(formattedDate),
    enabled: !!selectedDate && isDialogOpen,
    retry: false,
  });

  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkIns"],
    queryFn: checkInApi.getAll,
  });

  const checkInDates = new Set(checkIns.map((checkIn) => checkIn.date));

  const serverDate = (props: any) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const dateString = day.format("YYYY-MM-DD");
    const hasCheckIn = checkInDates.has(dateString);

    return (
      <Badge
        key={dateString}
        overlap="circular"
        badgeContent={hasCheckIn ? "●" : undefined}
        color="primary"
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    );
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (!date) return;
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedDate(null);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          slots={{ day: serverDate }}
        />
      </LocalizationProvider>

      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>
          {selectedDate && selectedDate.format("MMMM DD, YYYY")}
        </DialogTitle>
        <DialogContent>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Typography color="error">
              No check-in found for the selected date.
            </Typography>
          ) : checkInData ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Mood: {getMoodLabel(checkInData.mood_scale)}
              </Typography>

              <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                <strong>Entry:</strong>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-wrap",
                  backgroundColor: "#f5f5f5",
                  padding: 2,
                  borderRadius: 1,
                }}
              >
                {checkInData.entry}
              </Typography>

              {checkInData.ai_feedback && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderLeft: "4px solid #3b82f6",
                    borderRadius: 1,
                    backgroundColor: "#f0f9ff",
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#1e40af", mb: 1 }}>
                    AI Insights
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                  >
                    {checkInData.ai_feedback}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Calendar;
