const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/taskmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Mongoose Schema
const TaskSchema = new mongoose.Schema({
  task: String,
  price: String,
  category: String,
  description: String,
  status: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', TaskSchema);

// ✅ Routes

// Welcome Route
app.get('/', (req, res) => {
  res.send('🚀 API is running. Use POST /addTask to submit tasks.');
});

// Get All Tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }); // latest first
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Add a Task
app.post('/addTask', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json({ message: '✅ Task saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save task' });
  }
});

app.get('/calendarEvents', async (req, res) => {
  try {
    const tasks = await Task.find();

    // Map MongoDB data to FullCalendar event format
    const events = tasks.map(task => ({
      title: task.task,
      date: task.createdAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
      color: '#007bff' // Optional: you can choose different colors dynamically
    }));

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

app.delete('/deleteTask/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️ Task deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// MARK task as completed
app.put('/completeTask/:id', async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { status: 'completed' });
    res.json({ message: '✅ Task marked as completed!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ✅ Server Start
app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
