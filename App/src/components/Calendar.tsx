import { useState, useEffect } from "react";
import { Dayjs } from "dayjs";
import { useAuth } from "@clerk/clerk-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { checkInApi } from "../../../api/app/api/services/checkInService";
import { setAuthTokenGetter } from "../../../api/app/axios/axiosInstance";
import CheckInDialog from "./CheckInDialog";

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

  const { data: checkIns = [] } = useQuery({
    queryKey: ["checkIns"],
    queryFn: checkInApi.getAll,
  });

  const checkInDates = new Set(checkIns.map((checkIn) => checkIn.date));

  const serverDate = (props: any) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const dateString = day.format("YYYY-MM-DD");
    const hasCheckIn = checkInDates.has(dateString);

    if (outsideCurrentMonth) {
      return (
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      );
    }

    return (
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <PickersDay {...other} day={day} />
        {hasCheckIn && (
          <Box
            sx={{
              position: "absolute",
              bottom: 4,
              left: "50%",
              transform: "translateX(-50%)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "success.main", // Green dot
            }}
          />
        )}
      </Box>
    );
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (!date) return;
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleExited = () => {
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

      <CheckInDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        selectedDate={selectedDate}
        onExited={handleExited}
      />
    </div>
  );
}

export default Calendar;
