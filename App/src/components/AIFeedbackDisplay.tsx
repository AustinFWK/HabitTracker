import { Box, Typography } from "@mui/material";
import Markdown from "markdown-to-jsx/react";

interface AIFeedbackDisplayProps {
  aiFeedback: string;
}

function AIFeedbackDisplay({ aiFeedback }: AIFeedbackDisplayProps) {
  if (!aiFeedback) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 3,
        borderLeft: "4px solid #ff6b6b",
        borderRadius: 2,
        backgroundColor: "#fff5f5",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Inter", sans-serif',
          color: "#ff6b6b",
          mb: 1.5,
          fontWeight: 600,
        }}
      >
        💡 AI Insights
      </Typography>
      <Typography
        variant="body1"
        sx={{
          whiteSpace: "pre-wrap",
          lineHeight: 1.8,
          color: "#2d3748",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <Markdown>{aiFeedback}</Markdown>
      </Typography>
    </Box>
  );
}

export default AIFeedbackDisplay;
