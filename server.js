const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const os = require('os'); // For retrieving the system username

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const users = {}; // To store usernames

// Serve static files
app.use(express.static('public'));

// WebSocket connection
io.on('connection', (socket) => {
  // Assign a random name to the user when they connect
  const randomNames = ['John', 'Alice', 'Bob', 'Sarah', 'Tom', 'Emma', 'David', 'Sophia', 'Lucas', 'Mia'];
  const randomIndex = Math.floor(Math.random() * randomNames.length);
  const randomName = randomNames[randomIndex];

  // Store the username associated with the socket ID
  users[socket.id] = randomName;

  // Send the random name to the client
  socket.emit('name update', users[socket.id]);

  console.log(`User connected: ${randomName} (${socket.id})`);

  // Handle incoming messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', { user: users[socket.id], message: msg });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
