import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

import Inventory from "./pages/Inventory";

import CompleteProfile from "./pages/CompleteProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="*" element={<Navigate to="/" />} />

      <Route
    path="/complete-profile"
    element={<CompleteProfile />}

/>
      <Route
      path="/inventory"
      element={<Inventory />}
/>
    </Routes>
  );
}

export default App;