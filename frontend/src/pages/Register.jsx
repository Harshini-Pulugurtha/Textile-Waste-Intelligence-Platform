import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        role: "",
        organization: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await API.post("/auth/register", formData);

            navigate("/login", {
                state: {
                    message: "Registration successful! Please login."
                }
            });

        } catch (error) {

            if (error.response) {
                alert(error.response.data.detail);
            } else {
                alert("Registration failed. Please try again.");
            }

        }
    };

    return (
        <>
            <Navbar />

            <div className="register-container">

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <h2>Create Account</h2>

                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="role"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Role</option>

                        <option value="recycling_operator">
                            Recycling Facility Operator
                        </option>

                        <option value="manufacturer">
                            Textile Manufacturer
                        </option>

                        <option value="sustainability_manager">
                            Sustainability Manager
                        </option>

                        <option value="admin">
                            Administrator
                        </option>

                    </select>

                    <input
                        type="text"
                        name="organization"
                        placeholder="Organization"
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Register
                    </button>

                    <p>
                        Already have an account?{" "}
                        <Link to="/login">
                            Login
                        </Link>
                    </p>

                </form>

            </div>

            <Footer />
        </>
    );
}

export default Register;