export const MOODS = [
  { value: 1, label: "Very Bad" },
  { value: 2, label: "Bad" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Good" },
  { value: 5, label: "Very Good" },
];

export const getMoodLabel = (moodScale: number): string => {
  const mood = MOODS.find((m) => m.value === moodScale);
  return mood?.label || "Unknown";
};
