import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setRole(decoded.role);
      setUsername(decoded.username);
    } catch (err) {
      console.error("Invalid token");
      navigate("/");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  return (
    <div>

      {/* NAVBAR */}
      <div className="navbar">
        <div className="brand">EventZen</div>
        <div className="welcome">Welcome, {username}</div>
      </div>

      <button className="dash-logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <div className="dashboard-container">
        <h2 className="dashboard-title">Dashboard</h2>
        {/* ADMIN */}
        {role === "ADMIN" && (
          <div>
            <h3 className="panel-title">Admin Panel</h3>

            <h1 className="dash-admin-slogan">
              Enhancing event planning through structured management.
            </h1>
            <div className="dashboard-card-grid">
              <div className="dashboard-card" onClick={() => navigate("/events")}>
                Event Management
              </div>

              <div className="dashboard-card" onClick={() => navigate("/budget")}>
                Budget Management
              </div>

              <div className="dashboard-card" onClick={() => navigate("/attendee")}>
                Attendee Management
              </div>
            </div>
          </div>
        )}
        {/* USER */}
        {role === "USER" && (
          <div>
            <h3 className="panel-title">User Panel</h3>

            <h1 className="dash-user-slogan">
              Discover, register, and enjoy—effortlessly.
            </h1>
            <div className="dashboard-card-grid">
              <div className="dashboard-card" onClick={() => navigate("/events")}>
                View Events
              </div>

              <div className="dashboard-card" onClick={() => navigate("/bookings")}>
                Your Bookings
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}