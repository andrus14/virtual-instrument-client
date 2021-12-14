// Socket.io server configuration
const socket = io("http://localhost:8000");
// const socket = io("https://kak-socketio-server.herokuapp.com");
// const socket = io("http://10.25.184.72:8000"); // Nauka test
// const socket = io("http://10.25.185.227:8000"); // Kristjani tiim

// const socket = io("http://10.25.184.188:8000"); // Terje ja Jana

socket.on("connect", () => {
  console.log("Client connected to: " + socket.id);
  // online = true;
});

socket.on('send-data', res => {
  recieveData(res); 
});

socket.on("disconnect", () => {
  console.log("Client disconnected from" + socket.id); 
});