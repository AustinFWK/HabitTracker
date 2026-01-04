import { Dayjs } from "dayjs";
import { useState, useEffect } from "react";
import { getMoodLabel } from "../utils/moods";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { checkInApi } from "../../../api/app/api/services/checkInService";
import AIFeedbackDisplay from "./AIFeedbackDisplay";
import CheckInFormFields from "./CheckInFormFields";

interface CheckInFormData {
  entry: string;
  mood_scale: number;
}

interface CheckInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExited?: () => void;
  selectedDate: Dayjs | null;
}

function CheckInDialog({
  isOpen,
  onClose,
  onExited,
  selectedDate,
}: CheckInDialogProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const queryClient = useQueryClient();
  const formattedDate = selectedDate?.format("YYYY-MM-DD") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CheckInFormData>();

  const {
    data: checkInData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["checkIn", formattedDate],
    queryFn: () => checkInApi.getByDate(formattedDate),
    enabled: !!selectedDate && isOpen,
    retry: false,
  });

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      slotProps={{
        transition: { onExited },
      }}
    >
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
              <Box sx={{ mt: 3 }}>
                <AIFeedbackDisplay aiFeedback={checkInData.ai_feedback} />
              </Box>
            )}
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CheckInDialog;
