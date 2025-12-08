import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Typography } from "@mui/material";
import Home from "./pages/Home";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <>
        {/* User Button - Fixed Top Right */}
        <SignedIn>
          <div
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              zIndex: 1000,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "50%",
              padding: "6px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserButton />
          </div>
        </SignedIn>

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
