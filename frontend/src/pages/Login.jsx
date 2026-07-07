import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

import "./Login.css";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ===============================
    // Email & Password Login
    // ===============================
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post(
                "/auth/login",
                formData
            );

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");

        } catch (error) {

            if (error.response) {
                alert(error.response.data.detail);
            } else {
                alert("Login Failed");
            }

        }

    };

    // ===============================
    // Google Login
    // ===============================
    const handleGoogleSuccess = async (credentialResponse) => {

        try {

            const response = await API.post(
                "/auth/google",
                {
                    token: credentialResponse.credential
                }
            );

            // ------------------------------
            // First Time Google User
            // ------------------------------
            if (response.data.new_user) {

                navigate("/complete-profile", {
                    state: {
                        token: credentialResponse.credential,
                        full_name: response.data.full_name,
                        email: response.data.email
                    }
                });

                return;
            }

            // ------------------------------
            // Existing Google User
            // ------------------------------
            localStorage.setItem(
                "token",
                response.data.access_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            if (error.response) {
                alert(error.response.data.detail);
            } else {
                alert("Google Login Failed");
            }

        }

    };

    return (

        <>
            <Navbar />

            <div className="login-container">

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <h2>Login</h2>

                    {location.state?.message && (
                        <div className="success-message">
                            {location.state.message}
                        </div>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                    <div
                        style={{
                            marginTop: "20px",
                            marginBottom: "20px",
                            textAlign: "center"
                        }}
                    >

                        <p
                            style={{
                                marginBottom: "10px"
                            }}
                        >
                            OR
                        </p>

                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                alert("Google Login Failed");
                            }}
                        />

                    </div>

                    <p>
                        Don't have an account?{" "}
                        <Link to="/register">
                            Register
                        </Link>
                    </p>

                </form>

            </div>

            <Footer />
        </>

    );

}

export default Login;