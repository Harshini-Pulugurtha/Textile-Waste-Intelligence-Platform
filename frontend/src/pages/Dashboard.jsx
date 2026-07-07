import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaBoxes,
    FaWeightHanging,
    FaLayerGroup,
    FaCalendarDay,
    FaUserCircle,
    FaArrowRight
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getDashboardStats } from "../services/dashboardService";

import "./Dashboard.css";

const initialStats = {
    total_inventory: 0,
    total_quantity: 0,
    fabric_types: 0,
    today_entries: 0,
    recent_inventory: []
};

const statCards = [
    {
        key: "total_inventory",
        title: "Total Inventory",
        icon: FaBoxes,
        className: "inventory",
        formatValue: (stats) => stats.total_inventory
    },
    {
        key: "total_quantity",
        title: "Total Quantity",
        icon: FaWeightHanging,
        className: "quantity",
        formatValue: (stats) => `${stats.total_quantity} kg`
    },
    {
        key: "fabric_types",
        title: "Fabric Types",
        icon: FaLayerGroup,
        className: "fabric",
        formatValue: (stats) => stats.fabric_types
    },
    {
        key: "today_entries",
        title: "Today's Entries",
        icon: FaCalendarDay,
        className: "today",
        formatValue: (stats) => stats.today_entries
    }
];

const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch (error) {
        console.error("Invalid user data in localStorage", error);
        return null;
    }
};

function Dashboard() {
    const navigate = useNavigate();
    const user = getStoredUser();
    const [stats, setStats] = useState(initialStats);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            try {
                const response = await getDashboardStats();

                if (!isMounted) {
                    return;
                }

                setStats({
                    ...initialStats,
                    ...response.data,
                    recent_inventory: Array.isArray(response.data?.recent_inventory)
                        ? response.data.recent_inventory
                        : []
                });
            } catch (error) {
                console.error(error);

                if (isMounted) {
                    alert("Unable to load dashboard.");
                }
            }
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const recentInventory = Array.isArray(stats.recent_inventory)
        ? stats.recent_inventory
        : [];

    return (
        <>
            <Navbar />

            <div className="dashboard-container">
                <div className="dashboard-card">
                    <div>
                        <h1>Welcome, {user?.full_name || "User"}</h1>
                        <p>Textile Waste Intelligence Platform Dashboard</p>
                        <span>{user?.role || "No role assigned"}</span>
                    </div>

                    <div>{today}</div>
                </div>

                <div className="stats-grid">
                    {statCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div key={card.key} className={`stat-card ${card.className}`}>
                                <Icon className="stat-icon" />
                                <h3>{card.title}</h3>
                                <h2>{card.formatValue(stats)}</h2>
                            </div>
                        );
                    })}
                </div>

                <div className="profile-card">
                    <h2>
                        <FaUserCircle />
                        &nbsp;
                        User Profile
                    </h2>

                    <div className="profile-grid">
                        <div className="profile-item">
                            <label>Full Name</label>
                            <p>{user?.full_name || "Not Available"}</p>
                        </div>

                        <div className="profile-item">
                            <label>Email</label>
                            <p>{user?.email || "Not Available"}</p>
                        </div>

                        <div className="profile-item">
                            <label>Role</label>
                            <p>{user?.role || "Not Available"}</p>
                        </div>

                        <div className="profile-item">
                            <label>Organization</label>
                            <p>{user?.organization || "Not Available"}</p>
                        </div>
                    </div>
                </div>

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
                            {recentInventory.length === 0 ? (
                                <tr>
                                    <td colSpan="3">No Inventory Available</td>
                                </tr>
                            ) : (
                                recentInventory.map((item) => (
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

                <div className="button-group">
                    <button className="profile-btn" onClick={() => navigate("/profile")}>
                        View Profile
                        <FaArrowRight />
                    </button>

                    <button className="inventory-btn" onClick={() => navigate("/inventory")}>
                        Inventory Management
                        <FaArrowRight />
                    </button>

                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Dashboard;