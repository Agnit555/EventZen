import { useEffect, useState } from "react";
import API from "../services/api";
import "./YourBookings.css";
import { useNavigate } from "react-router-dom";

export default function YourBookings() {

  const navigate = useNavigate();  // ✅ MOVE HERE

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/api/book/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="navbar">
        <div className="brand">EventZen</div>
      </div>

      <div className="yb-container">
        <h2 className="yb-title">Your Bookings</h2>

        {bookings.length === 0 ? (
          <p className="yb-empty">No bookings yet 😕</p>
        ) : (
          <div className="yb-grid">
            {bookings.map((e) => (
              <div key={e.id} className="yb-card">
                <h3>{e.title}</h3>

                <p className="yb-detail">📍 {e.venue}</p>
                <p className="yb-detail">📅 {e.date}</p>

                <p className="yb-status">Registered ✅</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="yb-back-btn"  // 🔥 use your fixed button class
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}