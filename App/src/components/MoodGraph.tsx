import { LineChart } from "@mui/x-charts/LineChart";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { checkInApi } from "../../../api/app/api/services/checkInService";
import { setAuthTokenGetter } from "../../../api/app/axios/axiosInstance";

function MoodGraph() {
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

  return (
    <div>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Box sx={{ textAlign: "center", padding: 3 }}>
          <Typography color="error">{isError}</Typography>
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
        />
      ) : (
        <Box sx={{ textAlign: "center", padding: 3 }}>
          <Typography variant="body1">
            No check-in data yet, start tracking your mood now!
          </Typography>
        </Box>
      )}
    </div>
  );
}

export default MoodGraph;
