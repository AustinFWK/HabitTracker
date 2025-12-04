import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Typography } from "@mui/material";
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
            <Typography variant="h3" gutterBottom>
              Welcome to HabitTracker!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Sign in to track your daily habits and moods
            </Typography>
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
