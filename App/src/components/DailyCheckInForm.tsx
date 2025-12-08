import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkInApi } from "../../../api/app/api/services/checkInService";
import { setAuthTokenGetter } from "../../../api/app/axios/axiosInstance";
import CheckInFormFields from "./CheckInFormFields";
import AIFeedbackDisplay from "./AIFeedbackDisplay";

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

  const queryClient = useQueryClient();

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

      queryClient.invalidateQueries({ queryKey: ["checkIns"] });
      queryClient.invalidateQueries({
        queryKey: ["checkIn", new Date().toLocaleDateString("en-CA")],
      });
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

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"DM Serif Display", serif',
            fontWeight: 700,
            background: "linear-gradient(135deg, #ff6b6b 0%, #f39c12 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {isSubmitted ? "✨ Great Job!" : "Daily Check-In"}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} id="check-in-form">
            {mutation.isError && (
              <Typography
                color="error"
                sx={{ mb: 2, p: 1.5, bgcolor: "#fee", borderRadius: 2 }}
              >
                Error submitting check-in. Please try again.
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
          <AIFeedbackDisplay aiFeedback={aiFeedback} />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {!isSubmitted ? (
          <>
            <Button
              onClick={handleClose}
              sx={{
                color: "#718096",
                fontFamily: '"Inter", sans-serif',
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="check-in-form"
              variant="contained"
              disabled={mutation.isPending}
              startIcon={mutation.isPending && <CircularProgress size={16} />}
              sx={{
                background: "linear-gradient(135deg, #ff6b6b 0%, #f39c12 100%)",
                color: "white",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                textTransform: "none",
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #f39c12 0%, #ff6b6b 100%)",
                  boxShadow: "0 6px 16px rgba(255, 107, 107, 0.4)",
                },
                "&:disabled": {
                  background: "#e2e8f0",
                  color: "#a0aec0",
                },
              }}
            >
              {mutation.isPending ? "Submitting..." : "Submit Check-In"}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleClose}
            variant="contained"
            fullWidth
            sx={{
              background: "linear-gradient(135deg, #ff6b6b 0%, #f39c12 100%)",
              color: "white",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              textTransform: "none",
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                background: "linear-gradient(135deg, #f39c12 0%, #ff6b6b 100%)",
              },
            }}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DailyCheckInForm;
