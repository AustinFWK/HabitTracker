import { TextField, Typography, Box, Chip } from "@mui/material";
import type {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import { MOODS } from "../utils/moods";

interface CheckInFormData {
  entry: string;
  mood_scale: number;
}

interface CheckInFormFieldsProps {
  register: UseFormRegister<CheckInFormData>;
  setValue: UseFormSetValue<CheckInFormData>;
  watch: UseFormWatch<CheckInFormData>;
  errors: FieldErrors<CheckInFormData>;
}

function CheckInFormFields({
  register,
  setValue,
  watch,
  errors,
}: CheckInFormFieldsProps) {
  return (
    <>
      {/* ensures entry can't be empty or just whitespace */}
      <TextField
        {...register("entry", {
          required: "Entry cannot be empty",
          validate: (value) => value.trim() !== "" || "Entry cannot be empty",
        })}
        onChange={(e) => {
          if (e.target.value.length <= 1000) {
            setValue("entry", e.target.value);
          }
        }}
        placeholder="Share your thoughts, feelings, and experiences..."
        multiline
        rows={5}
        fullWidth
        error={!!errors.entry}
        helperText={
          errors.entry?.message ||
          `${watch("entry")?.length || 0}/1000 characters`
        }
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
      <Typography
        variant="body1"
        sx={{
          mb: 1.5,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          color: "#1a202c",
        }}
      >
        How are you feeling?
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {MOODS.map((mood) => (
          <Chip
            key={mood.value}
            label={mood.label}
            onClick={() => setValue("mood_scale", mood.value)}
            color={watch("mood_scale") === mood.value ? "primary" : "default"}
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              fontSize: "0.95rem",
              py: 2.5,
              px: 1,
              cursor: "pointer",
              transition: "all 0.2s ease",
              ...(watch("mood_scale") === mood.value && {
                background: "linear-gradient(135deg, #ff6b6b 0%, #f39c12 100%)",
                color: "white",
                transform: "scale(1.05)",
                boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
              }),
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          />
        ))}
      </Box>
      {/* Hidden input to register mood_scale with react-hook-form */}
      <input
        type="hidden"
        {...register("mood_scale", {
          required: "Mood scale is required",
        })}
      />
      {errors.mood_scale && (
        <Typography color="error" sx={{ mt: 1, fontSize: "0.875rem" }}>
          {errors.mood_scale.message}
        </Typography>
      )}
    </>
  );
}

export default CheckInFormFields;
