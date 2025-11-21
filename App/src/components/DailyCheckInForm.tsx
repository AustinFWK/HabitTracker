import { useState } from "react";

function DailyCheckInForm() {
  const [entry, setEntry] = useState("");
  const [moodScale, setMoodScale] = useState<number | null>(null);

  return (
    <div>
      <h2>Daily Check-In</h2>
      <p>Entry: {entry}</p>
      <textarea value={entry} onChange={(e) => setEntry(e.target.value)} />
      <p>Mood Scale: {moodScale}</p>
    </div>
  );
}

export default DailyCheckInForm;
