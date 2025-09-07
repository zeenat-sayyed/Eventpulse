const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/EventPulse", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error:", err));

// Schema
const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  description: String
});
const Event = mongoose.model("Event", eventSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Get all events
app.get("/api/events", async (req, res) => {
  try{
  const events = await Event.find();
  res.json(events);
  } catch (err) {
    res.status(500).json({message: err.message });
  }
});

// Create event
app.post("/api/events", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update event
app.put("/api/events/:id", async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Event not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete event
app.delete("/api/events/:id", async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});