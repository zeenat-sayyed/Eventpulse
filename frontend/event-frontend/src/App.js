import React, { useEffect, useState } from "react";

function App() {
  const [events, setEvents] = useState([]);

  // Fetch events from backend
  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📅 Event List</h1>
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <strong>{event.title}</strong> <br />
              📍 {event.location} <br />
              📅 {event.date} <br />
              📝 {event.description}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;