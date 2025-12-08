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
