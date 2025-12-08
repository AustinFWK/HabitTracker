import { Fab, Zoom } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface CheckInFABProps {
  hasCheckedIn: boolean;
  onOpen: () => void;
}

function CheckInFAB({ hasCheckedIn, onOpen }: CheckInFABProps) {
  if (hasCheckedIn) {
    return null;
  }
  return (
    <Zoom in={!hasCheckedIn}>
      <Fab
        color="primary"
        aria-label="log your day"
        onClick={onOpen}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 72,
          height: 72,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
          "&:hover": {
            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
            transform: "scale(1.1) rotate(90deg)",
            boxShadow: "0 16px 50px rgba(102, 126, 234, 0.5)",
          },
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <AddIcon sx={{ fontSize: 32 }} />
      </Fab>
    </Zoom>
  );
}

export default CheckInFAB;
