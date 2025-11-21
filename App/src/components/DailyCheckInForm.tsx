import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

function DailyCheckInForm() {
  const [entry, setEntry] = useState("");
  const [moodScale, setMoodScale] = useState<number | null>(null);
  const [error, setError] = useState({
    entry: "",
    moodScale: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const moods = [
    { value: 1, label: "Very Bad" },
    { value: 2, label: "Bad" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Good" },
    { value: 5, label: "Very Good" },
  ];

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
      console.log("Form is valid, ready to submit");
    }
  };

  return (
    <div>
      <h2>Daily Check-In</h2>
      <form onSubmit={handleSubmit}>
        <p>Entry: {entry}</p>
        <textarea value={entry} onChange={(e) => setEntry(e.target.value)} />
        {error.entry && <p style={{ color: "red" }}>{error.entry}</p>}
        <p>Mood Scale: {moodScale}</p>
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setMoodScale(mood.value)}
            style={{
              border: moodScale === mood.value ? "2px solid blue" : "none",
            }}
          >
            {mood.label}
          </button>
        ))}
        {error.moodScale && <p style={{ color: "red" }}>{error.moodScale}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DailyCheckInForm;
