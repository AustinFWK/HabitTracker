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
import {
  setAuthTokenGetter,
  axiosInstance,
} from "../../../api/app/axios/axiosInstance";

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

  const onSubmit = async (data: CheckInFormData) => {
    setIsLoading(true);
    setAiFeedback("");
    try {
      const token = await getToken({ template: "backend" });
      const response = await fetch("http://127.0.0.1:8000/check_in/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to submit check-in");
      }

      const responseData = await response.json();

      if (responseData.ai_feedback) {
        setAiFeedback(responseData.ai_feedback);
      }

      console.log("Success!", responseData);

      setSuccessMessage("Check-in submitted succesfully!");
      setIsSubmitted(true);
      setTimeout(() => setSuccessMessage(""), 3000);
      reset();
    } catch (error) {
      console.error("Error submitting check-in:", error);
      setApiError("Failed to submit check-in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessMessage("");
    setApiError("");
    setAiFeedback("");
    onClose();
    reset();
    setIsSubmitted(false);
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
            {successMessage && (
              <Typography color="success.main" sx={{ mb: 1 }}>
                {successMessage}
              </Typography>
            )}
            {apiError && (
              <Typography color="error" sx={{ mb: 1 }}>
                {apiError}
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
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
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
