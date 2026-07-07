import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRecycle } from "react-icons/fa";

import "./Navbar.css";

function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    return (

        <nav className="navbar">

            {/* ==========================
                Logo
            ========================== */}

            <div
                className="logo"
                onClick={() => navigate("/")}
            >

                <FaRecycle className="logo-icon" />

                <div className="logo-text">

                    <h2>Textile Waste</h2>

                    <span>Intelligence Platform</span>

                </div>

            </div>

            {/* ==========================
                Before Login
            ========================== */}

            {!token ? (

                <div className="nav-links">

                    <Link
                        to="/"
                        className={location.pathname === "/" ? "active" : ""}
                    >
                        Home
                    </Link>

                    <Link
                        to="/login"
                        className={location.pathname === "/login" ? "active" : ""}
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className={location.pathname === "/register" ? "active" : ""}
                    >
                        Register
                    </Link>

                </div>

            ) : (

                /* ==========================
                   After Login
                ========================== */

                <div className="nav-right">

                    <div className="nav-links">

                        <Link
                            to="/dashboard"
                            className={location.pathname === "/dashboard" ? "active" : ""}
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/inventory"
                            className={location.pathname === "/inventory" ? "active" : ""}
                        >
                            Inventory
                        </Link>

                        <Link
                            to="/profile"
                            className={location.pathname === "/profile" ? "active" : ""}
                        >
                            Profile
                        </Link>

                    </div>

                    <div className="user-section">

                        <div className="avatar">

                            {user?.full_name
                                ? user.full_name.charAt(0).toUpperCase()
                                : "U"}

                        </div>

                        <div className="user-info">

                            <span className="user-name">
                                {user?.full_name}
                            </span>

                            <span className="user-role">
                                {user?.role}
                            </span>

                        </div>

                        <button
                            className="logout-nav-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

            )}

        </nav>

    );

}

export default Navbar;