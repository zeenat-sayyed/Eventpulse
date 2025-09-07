import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const API = "http://localhost:5000/api/events";

function App() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const res = await axios.get(API);
    const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(sorted);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.date) {
      alert("Title and Date are required");
      return;
    }

    if (editingId) {
      const res = await axios.put(`${API}/${editingId}`, form);
      setEvents(events.map(ev => (ev._id === editingId ? res.data : ev)));
      setEditingId(null);
    } else {
      const res = await axios.post(API, form);
      setEvents([res.data, ...events]);
    }

    setForm({ title: "", date: "", description: "" });
  }

  function startEdit(ev) {
    setEditingId(ev._id);
    setForm({ title: ev.title, date: ev.date, description: ev.description });
  }

  async function handleDelete(id) {
    await axios.delete(`${API}/${id}`);
    setEvents(events.filter(ev => ev._id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 flex items-center justify-center gap-2">
          📅 EventPulse
        </h1>
        <p className="text-gray-600 mt-2">Keep track of your important events</p>
      </header>

      {/* Form */}
      <section className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {editingId ? "Edit Event" : "Add New Event"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border p-2 rounded w-full"
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded w-full"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
          <textarea
            className="border p-2 rounded w-full"
            name="description"
            placeholder="Write event details..."
            rows="3"
            value={form.description}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              {editingId ? "Save Changes" : "Add Event"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Event List */}
      <section className="max-w-4xl mx-auto space-y-6">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center">No events yet. Add one above!</p>
        ) : (
          events.map(ev => (
            <div
              key={ev._id}
              className="bg-white shadow-md rounded-xl p-6 flex justify-between items-start hover:shadow-lg transition"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{ev.title}</h2>
                <p className="text-gray-500">{format(new Date(ev.date), "dd MMM yyyy")}</p>
                <p className="mt-2 text-gray-700">{ev.description || "No description"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(ev)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ev._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto text-center mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} EventPulse. All rights reserved.
      </footer>
    </div>
  );
}

export default App;