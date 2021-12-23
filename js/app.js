// Socket.io server configuration
const isOnline = false;

let serverURL = "https://kak-socketio-server.herokuapp.com";
serverURL = "http://localhost:8000";

if ( isOnline ) {
  const socket = io(serverURL);
  
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
}
