import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { MOODS } from "../utils/moods";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import "../styles/DailyCheckInForm.css";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { checkInApi } from "../../../api/app/api/services/checkInService";
import { setAuthTokenGetter } from "../../../api/app/axios/axiosInstance";

interface CheckInModal {
  isOpen: boolean;
  onClose: () => void;
}

interface CheckInFormData {
  entry: string;
  mood_scale: number;
}

function DailyCheckInForm({ isOpen, onClose }: CheckInModal) {
  const [aiFeedback, setAiFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CheckInFormData>();

  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(() =>
      getToken({
        template: "backend",
      })
    );
  }, [getToken]);

  const mutation = useMutation({
    mutationFn: checkInApi.create,
    onSuccess: (responseData) => {
      if (responseData.ai_feedback) {
        setAiFeedback(responseData.ai_feedback);
      }
      setIsSubmitted(true);
      reset();
    },
    onError: (error) => {
      console.error("Error submitting check-in:", error);
    },
  });

  const onSubmit = async (data: CheckInFormData) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    reset();
    setAiFeedback("");
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <CloseIcon
          onClick={handleClose}
          style={{ cursor: "pointer", float: "right" }}
        />
        <Typography variant="h4" gutterBottom>
          Daily Check-In
        </Typography>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            {mutation.isError && (
              <Typography color="error" sx={{ mb: 1 }}>
                Error submitting check-in. Please try again.
              </Typography>
            )}
            <TextField
              {...register("entry", {
                required: "Entry cannot be empty",
                validate: (value) =>
                  value.trim() !== "" || "Entry cannot be empty",
              })}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setValue("entry", e.target.value);
                }
              }}
              label="How was your day?"
              multiline
              rows={4}
              fullWidth
              color="primary"
              error={!!errors.entry}
              helperText={
                errors.entry?.message ||
                `${watch("entry")?.length || 0}/1000 characters`
              }
            />
            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              Mood Scale: {watch("mood_scale")}
            </Typography>
            {MOODS.map((mood) => (
              <button
                type="button"
                key={mood.value}
                onClick={() => setValue("mood_scale", mood.value)}
                style={{
                  border:
                    watch("mood_scale") === mood.value
                      ? "2px solid blue"
                      : "none",
                }}
              >
                {mood.label}
              </button>
            ))}
            <input
              type="hidden"
              {...register("mood_scale", {
                required: "Mood scale is required",
              })}
            />
            {errors.mood_scale && (
              <Typography color="error" sx={{ mt: 1 }}>
                {errors.mood_scale.message}
              </Typography>
            )}
            <button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit"}
            </button>
          </form>
        ) : (
          aiFeedback && (
            <Box
              sx={{
                mt: 4,
                p: 2,
                borderLeft: "4px solid #3b82f6",
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" sx={{ mt: 0, color: "#1e40af", mb: 1 }}>
                💡 AI Insights
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
              >
                {aiFeedback}
              </Typography>
            </Box>
          )
        )}
      </div>
    </div>
  );
}

export default DailyCheckInForm;
