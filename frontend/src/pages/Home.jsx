import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />

      <section className="hero">

        <div className="hero-content">

          <h1>
            Textile Waste Intelligence Platform
          </h1>

          <p>
            Empowering sustainable textile waste management using
            Artificial Intelligence, Computer Vision, and Data Analytics.
          </p>

          <div className="hero-buttons">

            <Link to="/login">
              <button className="login-btn">
                Login
              </button>
            </Link>

            <Link to="/register">
              <button className="register-btn">
                Register
              </button>
            </Link>

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Home;