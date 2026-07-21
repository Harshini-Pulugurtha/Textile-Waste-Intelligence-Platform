import { Routes, Route, Navigate } from "react-router-dom";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Inventory from "./pages/Inventory";
import CompleteProfile from "./pages/CompleteProfile";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MaterialRecognition from "./pages/MaterialRecognition";
import AnalysisHistory from "./pages/AnalysisHistory";


function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />

            <Route
                path="/profile"
                element={<Profile />}
            />

            <Route
                path="/inventory"
                element={<Inventory />}
            />
            <Route
                path="/material-recognition"
                element={<MaterialRecognition />}
            />

            <Route
                path="/complete-profile"
                element={<CompleteProfile />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

            <Route
                path="*"
                element={<Navigate to="/" />}
            />
            <Route
                path="/analysis-history"
                element={<AnalysisHistory />}
            />

        </Routes>

    );

}

export default App;