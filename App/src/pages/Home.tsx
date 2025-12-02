import Calendar from "../components/Calendar";
import DailyCheckInForm from "../components/DailyCheckInForm";
import MoodGraph from "../components/MoodGraph";
function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the Home page!</p>
      <DailyCheckInForm />
      <Calendar />
      <MoodGraph />
    </div>
  );
}

export default Home;
