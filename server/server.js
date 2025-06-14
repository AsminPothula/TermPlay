const WebSocket = require('ws');
const { Server } = require("socket.io");
const { createServer } = require("http");

const SnakeGameRoom = require('./rooms/SnakeGameRoom');
const { startTickLoop, getOrCreateRoom } = require('./tick');

// WebSocket server for client.py
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('🟢 New raw WebSocket connection (from client.py)');
  let playerId = Date.now().toString();
  let currentRoom = null;

  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    console.log('📨 Received (raw WS):', data);
  
    if (data.type === 'join') {
      const roomId = data.room;
      const playerId = data.name || Date.now().toString(); // ✅ use nickname
      const room = getOrCreateRoom(roomId, SnakeGameRoom);
  
      room.addPlayer(playerId, ws);
      currentRoom = room;
  
      ws.send(JSON.stringify({ type: 'connected', playerId }));
    }
  
    if (data.type === 'input' && currentRoom) {
      currentRoom.receiveInput(playerId, data.direction);
    }
  });
  
  ws.on('close', () => {
    console.log('🔴 Raw WebSocket connection closed');
    if (currentRoom) currentRoom.removePlayer(playerId);
  });

  ws.send(JSON.stringify({ type: 'welcome' }));
});

// Socket.IO server for GameViewer
const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });

io.on('connection', (socket) => {
  console.log('✨ New Socket.IO connection (GameViewer)');
  const roomToWatch = getOrCreateRoom("snake-room", SnakeGameRoom);
  roomToWatch.addSocketIoViewer(socket);
});

httpServer.listen(8081, () => {
  console.log('🚀 Socket.IO server listening on port 8081');
});

startTickLoop();
