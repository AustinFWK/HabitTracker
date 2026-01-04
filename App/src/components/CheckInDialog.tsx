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

  // Populate form when data is fetched
  useEffect(() => {
    if (isEditMode && checkInData) {
      setValue("entry", checkInData.entry);
      setValue("mood_scale", checkInData.mood_scale);
    }
  }, [isEditMode, checkInData, setValue]);

  // Reset edit mode when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditMode(false);
      reset();
    }
  }, [isOpen, reset]);

  const mutation = useMutation({
    mutationFn: (data: CheckInFormData) =>
      checkInApi.update(formattedDate, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkIns"] });
      queryClient.invalidateQueries({ queryKey: ["checkIn", formattedDate] });
      setIsEditMode(false);
    },
    onError: (error) => {
      console.error("Error updating check-in:", error);
    },
  });

  const onSubmit = (data: CheckInFormData) => {
    mutation.mutate(data);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    reset();
  };

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
          isEditMode ? (
            <form onSubmit={handleSubmit(onSubmit)} id="edit-check-in-form">
              {mutation.isError && (
                <Typography
                  color="error"
                  sx={{ mb: 2, p: 1.5, bgcolor: "#fee", borderRadius: 2 }}
                >
                  Error updating check-in. Please try again.
                </Typography>
              )}
              <CheckInFormFields
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
              />
            </form>
          ) : (
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
          )
        ) : null}
      </DialogContent>
      <DialogActions>
        {isEditMode ? (
          <>
            <Button onClick={handleCancelEdit} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-check-in-form"
              variant="contained"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditMode(true)} variant="contained">
              Edit
            </Button>
            <Button onClick={onClose}>Close</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default CheckInDialog;
