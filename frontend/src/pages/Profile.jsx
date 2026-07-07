import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

import "./Profile.css";

function Profile() {

    const storedUser = JSON.parse(localStorage.getItem("user"));

    const [user, setUser] = useState(storedUser);

    const [formData, setFormData] = useState({
        full_name: storedUser?.full_name || "",
        organization: storedUser?.organization || ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const response = await API.put(
                "/profile/update",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            setUser(response.data.user);

            alert("Profile Updated Successfully");

        } catch (error) {

            console.error(error);

            if (error.response) {
                alert(error.response.data.detail);
            } else {
                alert("Profile Update Failed");
            }

        }

    };

    return (
        <>
            <Navbar />

            <div className="profile-container">

                <div className="profile-box">

                    <h2>User Profile</h2>

                    <form onSubmit={handleUpdate}>

                        <label>Full Name</label>

                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                        />

                        <label>Email</label>

                        <input
                            type="email"
                            value={user?.email}
                            disabled
                        />

                        <label>Role</label>

                        <input
                            type="text"
                            value={user?.role}
                            disabled
                        />

                        <label>Organization</label>

                        <input
                            type="text"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                        />

                        <button type="submit">
                            Update Profile
                        </button>

                    </form>

                </div>

            </div>

            <Footer />
        </>
    );
}

export default Profile;