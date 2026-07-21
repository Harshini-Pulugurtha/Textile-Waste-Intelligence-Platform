import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaBoxes,
    FaWeightHanging,
    FaLayerGroup,
    FaCalendarDay,
    FaUserCircle,
    FaArrowRight,
    FaRobot,
    FaBullseye,
    FaRecycle,
    FaTshirt
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    getDashboardStats,
    getAnalysisStats,
    getWasteDistribution
} from "../services/dashboardService";

import { Pie } from "react-chartjs-2";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

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

    const [analysisStats, setAnalysisStats] = useState({
    total_analyses: 0,
    reusable: 0,
    recyclable: 0,
    disposal: 0
});
    const [wasteData, setWasteData] = useState([]);

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

                const analysisResponse = await getAnalysisStats();
                const wasteResponse = await getWasteDistribution();

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
                setAnalysisStats(analysisResponse.data);
                setWasteData(wasteResponse.data);
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

const wasteChartData = {
    labels: wasteData.map(item => item.category),
    datasets: [
        {
            data: wasteData.map(item => item.count),
            backgroundColor: [
                "#10B981",
                "#F59E0B",
                "#EF4444"
            ]
        }
    ]
};

    return (
        <>
            <Navbar />

            <div className="dashboard-container">
                <div className="dashboard-card">

                <div className="welcome-section">

                    <h1>
                        👋 Welcome back, {user?.full_name || "User"}
                    </h1>

                    <h3>
                        AI Textile Waste Intelligence Platform
                    </h3>

                    <p>
                        Monitor textile inventory, AI analysis,
                        sustainability metrics and recycling insights.
                    </p>
                    <div className="dashboard-status">

                        <span>🤖 AI Ready</span>

                        <span>♻ Sustainability Enabled</span>

                        <span>📦 Inventory Connected</span>

                    </div>

                </div>

                <div className="date-section">

                    <h4>📅 {today}</h4>

                    <span className="role-badge">
                        {user?.role}
                    </span>

                </div>

            </div>

                <div className="stats-grid">
                    {statCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div key={card.key} className={`stat-card ${card.className}`}>
                                <Icon className="stat-icon" />
                                <h3>{card.title}</h3>
                                <h2>{card.formatValue(stats)}</h2>
                                <p className="stat-status">
                                    ● Live Data
                                </p>
                            </div>
                        );
                    })}
                </div>
                <div className="stats-grid">

    <div className="stat-card analysis">
        <FaRobot className="stat-icon" />
        <h3>Total Analyses</h3>
        <h2>{analysisStats.total_analyses}</h2>
    </div>

    <div className="stat-card reusable">
        <FaRecycle className="stat-icon" />
        <h3>Reusable Items</h3>
        <h2>{analysisStats.reusable}</h2>
    </div>

    
</div>
                    <div className="section-title">
                        <h2>📊 Analytics Dashboard</h2>
                        <p>Visual insights from AI analysis and textile inventory.</p>
                    </div>
                    <div className="chart-grid">

                        <div className="chart-card">
                            <h2>Waste Distribution</h2>

                            <Pie data={wasteChartData} />
                        </div>

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
                    <button
                        className="analysis-btn"
                        onClick={() => navigate("/material-recognition")}
                    >
                        AI Analysis
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