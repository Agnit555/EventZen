import { useEffect, useState } from "react";
import API from "../services/api";
import "./Events.css";
import { useNavigate } from "react-router-dom";

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState(null);
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setRole(decoded.role);
    }

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await API.get("/api/events");
    setEvents(res.data);
  };

  const createEvent = async () => {
    await API.post("/api/events", { title, venue, date });
    // CLEAR INPUTS
    setTitle("");
    setVenue("");
    setDate("");
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    console.log("Deleting ID:", id); // 🔥 ADD

    try {
      await API.delete(`/api/events/${id}`);
      alert("Deleted ✅");
      fetchEvents();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  const updateEvent = async () => {
    console.log("Updating ID:", editId); // 🔥 ADD

    try {
      await API.put(`/api/events/${editId}`, {
        title,
        venue,
        date,
      });

      alert("Updated ✅");
      setEditId(null);
      fetchEvents();
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  const registerEvent = async (eventId) => {
    try {
      await API.post("/api/book/bookings", {
        event_id: eventId,
      });

      alert("Registered successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to register");
    }
  };

  return (
    <div>
      <div className="navbar">
        <div className="brand">EventZen</div>
      </div>

      <button
        className="event-back-btn"  
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="event-container">
      <h2 className="event-title">Events</h2>

      {/* ADMIN ONLY */}
        {role === "ADMIN" && (
          <div className="event-form">
            <input
              className="event-input"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="event-input"
              placeholder="Venue"
              onChange={(e) => setVenue(e.target.value)}
            />
            <input
              className="event-input"
              placeholder="Date"
              onChange={(e) => setDate(e.target.value)}
            />

            {editId ? (
              <button className="event-btn event-btn-secondary" onClick={updateEvent}>
                Update
              </button>
            ) : (
              <button className="event-btn event-btn-primary" onClick={createEvent}>
                Create
              </button>
            )}
          </div>
        )}

      <hr />

      {/* EVENTS LIST */}
        <div className="event-list">
          {events.map((e) => (
            <div key={e.id} className="event-card">
              <h4>{e.title}</h4>
              <p>{e.venue} | {e.date}</p>

              <div className="event-actions">
                {role === "USER" && (
                  <button
                    className="event-btn event-btn-primary"
                    onClick={() => registerEvent(e.id)}
                  >
                    Register
                  </button>
                )}

                {role === "ADMIN" && (
                  <>
                    <button
                      className="event-btn event-btn-danger"
                      onClick={() => deleteEvent(e.id)}
                    >
                      Delete
                    </button>

                    <button
                      className="event-btn event-btn-secondary"
                      onClick={() => {
                        setEditId(e.id);
                        setTitle(e.title);
                        setVenue(e.venue);
                        setDate(e.date);
                      }}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}