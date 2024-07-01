const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const socketIO = require('socket.io');

const PORT = 5001;

// Replace <dbname> with your actual database name
const mongoURI = 'mongodb+srv://subhadipdas:root@subha.fuw7oej.mongodb.net/<connection>?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// API endpoint
app.get('/api/some-endpoint', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Start the server
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Setup Socket.IO
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('document-edit', (data) => {
    socket.broadcast.emit('document-edit', data);
  });
  
  socket.on('disconnect', () => console.log('Client disconnected'));
});
