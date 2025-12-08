import { Box, Typography, Zoom } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface StatusBadgeProps {
  hasCheckedIn: boolean;
}

function StatusBadge({ hasCheckedIn }: StatusBadgeProps) {
  if (!hasCheckedIn) {
    return null;
  }
  return (
    <Zoom in={hasCheckedIn}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 3,
          py: 1.5,
          mb: 3,
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "50px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          animation: "fadeInUp 0.6s ease-out 0.4s backwards",
        }}
      >
        <CheckCircleIcon sx={{ color: "#10b981", fontSize: 24 }} />
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            color: "#10b981",
            fontSize: "1rem",
          }}
        >
          Check-in complete!
        </Typography>
      </Box>
    </Zoom>
  );
}

export default StatusBadge;
