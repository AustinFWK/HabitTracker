import { Box, Typography } from "@mui/material";
import Calendar from "./Calendar";
import MoodGraph from "./MoodGraph";

function DataVisualizationGrid() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
        animation: "fadeInUp 0.6s ease-out 0.6s backwards",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 4,
          p: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 25px 70px rgba(0,0,0,0.2)",
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"DM Serif Display", serif',
            mb: 2,
            color: "#1a202c",
          }}
        >
          Your Calendar
        </Typography>
        <Calendar />
      </Box>

      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 4,
          p: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 25px 70px rgba(0,0,0,0.2)",
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"DM Serif Display", serif',
            mb: 2,
            color: "#1a202c",
          }}
        >
          Mood Trends
        </Typography>
        <MoodGraph />
      </Box>
    </Box>
  );
}

export default DataVisualizationGrid;
