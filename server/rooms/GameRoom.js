class GameRoom {
  constructor(roomId) {
    this.roomId = roomId;
    this.wsPlayers = {}; // playerId -> raw ws connection
    this.socketIoViewers = [];
    this.state = {};
  }

  addPlayer(playerId, ws) {
    this.wsPlayers[playerId] = ws;
    console.log(`👤 Raw WS Player ${playerId} joined room ${this.roomId}`);
  }

  addSocketIoViewer(socket) {
    this.socketIoViewers.push(socket);
    console.log(`📺 Socket.IO Viewer connected to room ${this.roomId}`);
  }

  removePlayer(playerId) {
    delete this.wsPlayers[playerId];
    console.log(`👤 Raw WS Player ${playerId} left room ${this.roomId}`);
  }

  removeSocketIoViewer(socketId) {
    this.socketIoViewers = this.socketIoViewers.filter(s => s.id !== socketId);
    console.log(`📺 Socket.IO Viewer ${socketId} disconnected from room ${this.roomId}`);
  }

  broadcast(msg) {
    const data = JSON.stringify(msg);

    // WS players
    Object.values(this.wsPlayers).forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        ws.send(data);
      }
    });

    // Socket.IO viewers
    this.socketIoViewers.forEach(socket => {
      socket.emit('message', data);
    });
  }
}

module.exports = GameRoom;
