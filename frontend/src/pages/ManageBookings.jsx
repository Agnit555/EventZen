import { useEffect, useState } from "react";
import API from "../api";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchEvents();
  }, []);

  const fetchBookings = async () => {
    const res = await API.get("/bookings");
    setBookings(res.data);
  };

  const fetchEvents = async () => {
    const res = await API.get("/events");
    setEvents(res.data);
  };

  const getEventDetails = (eventId) => {
    return events.find((e) => e.id === eventId);
  };

  return (
    <div>
      <h2>My Bookings</h2>

      {bookings.map((b) => {
        const event = getEventDetails(b.event_id);

        return (
          <div key={b.id}>
            <h3>{event?.title}</h3>
            <p>{event?.venue} | {event?.date}</p>
          </div>
        );
      })}
    </div>
  );
}