import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { getDashboardStats } from "../services/dashboardService";

import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [stats, setStats] = useState({
        total_inventory: 0,
        total_quantity: 0,
        fabric_types: 0,
        today_entries: 0,
        recent_inventory: []
    });

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const response = await getDashboardStats();

            setStats(response.data);

        } catch (error) {

            console.log(error);

            alert("Unable to load dashboard.");

        }

    };

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <>
            <Navbar />

            <div className="dashboard-container">

                {/* Welcome */}

                <div className="dashboard-card">

                    <h1>
                        Welcome, {user?.full_name} 👋
                    </h1>

                    <p>
                        Successfully logged into the Textile Waste Intelligence Platform.
                    </p>

                </div>

                {/* Statistics */}

                <div className="stats-grid">

                    <div className="stat-card">

                        <h3>Total Inventory</h3>

                        <h2>{stats.total_inventory}</h2>

                    </div>

                    <div className="stat-card">

                        <h3>Total Quantity</h3>

                        <h2>{stats.total_quantity} kg</h2>

                    </div>

                    <div className="stat-card">

                        <h3>Fabric Types</h3>

                        <h2>{stats.fabric_types}</h2>

                    </div>

                    <div className="stat-card">

                        <h3>Today's Entries</h3>

                        <h2>{stats.today_entries}</h2>

                    </div>

                </div>

                {/* User Information */}

                <div className="profile-card">

                    <h2>User Information</h2>

                    <div className="profile-grid">

                        <div className="profile-item">
                            <label>Full Name</label>
                            <p>{user?.full_name}</p>
                        </div>

                        <div className="profile-item">
                            <label>Email</label>
                            <p>{user?.email}</p>
                        </div>

                        <div className="profile-item">
                            <label>Role</label>
                            <p>{user?.role}</p>
                        </div>

                        <div className="profile-item">
                            <label>Organization</label>
                            <p>{user?.organization || "Not Available"}</p>
                        </div>

                    </div>

                </div>

                {/* Recent Inventory */}

                <div className="recent-card">

                    <h2>Recent Inventory</h2>

                    <table>

                        <thead>

                            <tr>

                                <th>Batch ID</th>
                                <th>Fabric</th>
                                <th>Quantity</th>

                            </tr>

                        </thead>

                        <tbody>

                            {stats.recent_inventory.length === 0 ? (

                                <tr>

                                    <td colSpan="3">
                                        No Inventory Available
                                    </td>

                                </tr>

                            ) : (

                                stats.recent_inventory.map((item) => (

                                    <tr key={item.id}>

                                        <td>{item.waste_batch_id}</td>

                                        <td>{item.fabric_type}</td>

                                        <td>{item.quantity}</td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

                {/* Quick Actions */}

                <div className="button-group">

                    <button
                        className="profile-btn"
                        onClick={() => navigate("/profile")}
                    >
                        View Profile
                    </button>

                    <button
                        className="inventory-btn"
                        onClick={() => navigate("/inventory")}
                    >
                        Inventory Management
                    </button>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

            <Footer />

        </>

    );

}

export default Dashboard;