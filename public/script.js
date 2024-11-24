const socket = io();
const messages = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// Set the default name as a random name
let userName = generateRandomName();

// Function to generate a random name
function generateRandomName() {
  const randomNames = ['John', 'Alice', 'Bob', 'Sarah', 'Tom', 'Emma', 'David', 'Sophia', 'Lucas', 'Mia'];
  const randomIndex = Math.floor(Math.random() * randomNames.length);
  return randomNames[randomIndex];
}

// Receive initial name from the server (after the user is assigned a name)
socket.on('name update', (name) => {
  userName = name;
});

// Handle message sending
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chat message', message);
    messageInput.value = '';
  }
});

// Display incoming messages
socket.on('chat message', ({ user, message }) => {
  const messageElement = document.createElement('div');
  const isSender = user === userName;

  // Create a wrapper for message alignment
  const messageWrapper = document.createElement('div');
  messageWrapper.className = `flex ${isSender ? 'justify-end' : 'justify-start'}`;

  // Apply unique background colors
  const bgColor = isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black';

  messageElement.className = `p-2 rounded shadow max-w-xs break-words ${bgColor}`;
  messageElement.textContent = `${user}: ${message}`;

  // Append the message to the wrapper and then to the container
  messageWrapper.appendChild(messageElement);
  messages.appendChild(messageWrapper);

  // Auto-scroll to the latest message
  messages.scrollTop = messages.scrollHeight;
});
