import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <>
        <header>
          <SignedIn>
            <UserButton />
            <nav>
              <Link to="/">Home</Link>
              <Link to="/history">History</Link>
            </nav>
          </SignedIn>
        </header>
        <SignedOut>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "80vh",
              textAlign: "center",
            }}
          >
            <h1>Welcome to HabitTracker!</h1>
            <p>Sign in to track your daily habits and moods</p>
            <SignInButton mode="modal" />
          </div>
        </SignedOut>
        <SignedIn>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </SignedIn>
      </>
    </BrowserRouter>
  );
}
