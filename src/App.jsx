import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import GeneratedPitch from "./pages/GeneratedPitch";
import CreatedPitch from "./pages/CreatedPitch";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import RouteGuard from "./components/AuthRoute";
import PitchDetails from "./pages/PitchDetails";

const App = () => {
  return (
    <div>
      <Toaster  />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<RouteGuard isProtected={true} />}>
          <Route path="/generate-pitch" element={<GeneratedPitch />} />
          <Route path="/your-pitch" element={<CreatedPitch />} />
          <Route path="/pitch-details/:id" element={<PitchDetails />} />
        </Route>

        <Route element={<RouteGuard isProtected={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        
      </Routes>
    </div>
  );
};

export default App;
