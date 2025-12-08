import { LineChart } from "@mui/x-charts/LineChart";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { checkInApi } from "../../../api/app/api/services/checkInService";
import { setAuthTokenGetter } from "../../../api/app/axios/axiosInstance";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import CheckInDialog from "./CheckInDialog";

function MoodGraph() {
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

  const {
    data: checkIns = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["checkIns"],
    queryFn: checkInApi.getAll,
  });

  const dates = checkIns.map((checkIn) => checkIn.date);
  const moods = checkIns.map((checkIn) => checkIn.mood_scale);

  const handlePointClick = (_event: any, itemData: any) => {
    if (itemData && itemData.dataIndex !== undefined) {
      const clickedDate = dates[itemData.dataIndex];
      setSelectedDate(dayjs(clickedDate));
      setIsDialogOpen(true);
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleExited = () => {
    setSelectedDate(null);
  };

  return (
    <div>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Box sx={{ textAlign: "center", padding: 3 }}>
          <Typography color="error">Error loading check-ins</Typography>
        </Box>
      ) : checkIns.length > 0 ? (
        <LineChart
          xAxis={[
            {
              data: dates,
              scaleType: "point",
            },
          ]}
          yAxis={[
            {
              min: 1,
              max: 5,
              tickNumber: 5,
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
          margin={{ left: 50, right: 50, top: 50, bottom: 50 }}
          onMarkClick={handlePointClick}
        />
      ) : (
        <Box sx={{ textAlign: "center", padding: 3 }}>
          <Typography variant="body1">
            No check-in data yet, start tracking your mood now!
          </Typography>
        </Box>
      )}
      <CheckInDialog
        isOpen={isDialogOpen}
        onClose={handleClose}
        selectedDate={selectedDate}
        onExited={handleExited}
      />
    </div>
  );
}

export default MoodGraph;
