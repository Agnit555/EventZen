import { useEffect, useState } from "react";
import API from "../services/api";
import "./Attendee.css";
import { useNavigate } from "react-router-dom";

export default function Attendee() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const navigate = useNavigate();

  // 🔹 Load Events
  useEffect(() => {
    API.get("/api/attendee/events")
      .then(res => setEvents(res.data))
      .catch(err => console.error("Error loading events:", err));
  }, []);

  // 🔹 Load Attendees
    const loadAttendees = async (eventId) => {
        try {
            console.log("CLICKED EVENT:", eventId); // 👈 ADD THIS

            const res = await API.get(`http://localhost:7200/event/${eventId}`);

            console.log("ATTENDEES:", res.data); // 👈 ADD THIS

            setAttendees(res.data);
            setSelectedEvent(eventId);
        } catch (err) {
            console.error("Error loading attendees:", err);
        }
    };

  // 🔹 Update Status
  const updateStatus = async (bookingId, status) => {
    try {
      await API.put(`/api/attendee/status/${bookingId}`, { status });
      loadAttendees(selectedEvent);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div>
      <div className="navbar">
        <div className="brand">EventZen</div>
      </div>

      <div className="atn-container">

      
        <h2 className="atn-title">Attendee Management</h2>

        
        <div className="atn-search">
          <input
            placeholder="Search events..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        
        <div className="atn-event-grid">
          {events
            .filter(e =>
              e.title.toLowerCase().includes(search.toLowerCase())
            )
            .map(event => (
              <div
                key={event.id}
                className="atn-event-card"
                onClick={() => {
                  loadAttendees(event.id);
                  setSelectedEventTitle(event.title);  
                }}
              >
                <h4>{event.title}</h4>
                <p>{event.venue}</p>
                <p>{event.date}</p>
              </div>
            ))}
        </div>

        {/*ATTENDEES */}
        {selectedEvent && (
          <div className="atn-attendees">

            {selectedEventTitle
              ? `${selectedEventTitle} - Attendees`
              : "Attendees"}

            {attendees.length === 0 ? (
              /* ✅ EMPTY STATE */
              <p className="atn-empty">No one registered yet 😕</p>
            ) : (
              /* ✅ NORMAL LIST */
              attendees.map(a => (
                <div key={a.bookingId} className="atn-user">

                  <span>
                    <b>{a.username}</b>
                  </span>

                  <span className={`atn-status atn-${a.status}`}>
                    {a.status}
                  </span>

                  {a.status === "pending" && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="event-btn event-btn-primary"
                        onClick={() => updateStatus(a.bookingId, "approved")}
                      >
                        Accept
                      </button>

                      <button
                        className="event-btn event-btn-danger"
                        onClick={() => updateStatus(a.bookingId, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                </div>
              ))
            )}

          </div>
        )}

      </div>

      <button
        className="atn-back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}