import { useState } from "react";

function DailyCheckInForm() {
  const [entry, setEntry] = useState("");
  const [moodScale, setMoodScale] = useState<number | null>(null);

  const moods = [
    { value: 1, label: "Very Bad" },
    { value: 2, label: "Bad" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Good" },
    { value: 5, label: "Very Good" },
  ];

  return (
    <div>
      <h2>Daily Check-In</h2>
      <p>Entry: {entry}</p>
      <textarea value={entry} onChange={(e) => setEntry(e.target.value)} />
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
    </div>
  );
}

export default DailyCheckInForm;
