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

  const { getToken } = useAuth();

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
      setIsLoading(true);
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
        console.log("Success!", data);

        setSuccessMessage("Check-in submitted succesfully!");
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

  return (
    <div>
      <h2>Daily Check-In</h2>
      <form onSubmit={handleSubmit}>
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {apiError && <p style={{ color: "red" }}>{apiError}</p>}
        <p>Entry: {entry}</p>
        <textarea value={entry} onChange={(e) => setEntry(e.target.value)} />
        {error.entry && <p style={{ color: "red" }}>{error.entry}</p>}
        <p>Mood Scale: {moodScale}</p>
        {moods.map((mood) => (
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
        {error.moodScale && <p style={{ color: "red" }}>{error.moodScale}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default DailyCheckInForm;
