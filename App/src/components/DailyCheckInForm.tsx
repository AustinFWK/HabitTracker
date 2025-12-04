import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { MOODS } from "../utils/moods";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import "../styles/DailyCheckInForm.css";

interface CheckInModal {
  isOpen: boolean;
  onClose: () => void;
}

function DailyCheckInForm({ isOpen, onClose }: CheckInModal) {
  const [entry, setEntry] = useState("");
  const [moodScale, setMoodScale] = useState<number | null>(null);
  const [error, setError] = useState({
    entry: "",
    moodScale: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError({ entry: "", moodScale: "" });
    let isValid = true;
    const newError = { entry: "", moodScale: "" };

    if (entry.trim() === "") {
      newError.entry = "Entry cannot be empty";
      isValid = false;
    }

    if (moodScale === null) {
      newError.moodScale = "Please select a mood";
      isValid = false;
    }

    setError(newError);

    if (isValid) {
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
          body: JSON.stringify({ entry: entry, mood_scale: moodScale }),
        });
        if (!response.ok) {
          throw new Error("Failed to submit check-in");
        }

        const data = await response.json();

        if (data.ai_feedback) {
          setAiFeedback(data.ai_feedback);
        }

        console.log("Success!", data);

        setSuccessMessage("Check-in submitted succesfully!");
        setIsSubmitted(true);
        setTimeout(() => setSuccessMessage(""), 3000);
        setEntry("");
        setMoodScale(null);
      } catch (error) {
        console.error("Error submitting check-in:", error);
        setApiError("Failed to submit check-in. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setEntry("");
    setMoodScale(null);
    setError({ entry: "", moodScale: "" });
    setSuccessMessage("");
    setApiError("");
    setAiFeedback("");
    onClose();
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
          <form onSubmit={handleSubmit}>
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
              value={entry}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setEntry(e.target.value);
                }
              }}
              label="How was your day?"
              multiline
              rows={4}
              fullWidth
              color="primary"
              helperText={`${entry.length}/1000 characters`}
            />
            {error.entry && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error.entry}
              </Typography>
            )}
            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              Mood Scale: {moodScale}
            </Typography>
            {MOODS.map((mood) => (
              <button
                type="button"
                key={mood.value}
                onClick={() => setMoodScale(mood.value)}
                style={{
                  border: moodScale === mood.value ? "2px solid blue" : "none",
                }}
              >
                {mood.label}
              </button>
            ))}
            {error.moodScale && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error.moodScale}
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
