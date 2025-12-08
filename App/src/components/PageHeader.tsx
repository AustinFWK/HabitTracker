import { Typography, Box } from "@mui/material";

interface PageHeaderProps {
  hasCheckedIn: boolean;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
};

function PageHeader({ hasCheckedIn }: PageHeaderProps) {
  const greeting = getGreeting();
  return (
    <Box
      sx={{
        mb: 4,
        animation: "fadeInDown 0.6s ease-out",
        "@keyframes fadeInDown": {
          from: {
            opacity: 0,
            transform: "translateY(-20px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontFamily: '"DM Serif Display", serif',
          fontWeight: 700,
          color: "white",
          mb: 1,
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          letterSpacing: "-0.02em",
        }}
      >
        Good {greeting}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Inter", sans-serif',
          fontWeight: 400,
          color: "rgba(255,255,255,0.9)",
          textShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        {hasCheckedIn ? "You're on track today" : "Ready to log your day?"}
      </Typography>
    </Box>
  );
}

export default PageHeader;
