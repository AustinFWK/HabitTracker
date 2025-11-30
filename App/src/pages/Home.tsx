import Calendar from "../components/Calendar";
import DailyCheckInForm from "../components/DailyCheckInForm";
function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the Home page!</p>
      <DailyCheckInForm />
      <Calendar />
    </div>
  );
}

export default Home;
