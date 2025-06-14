const rooms = {};

function startTickLoop() {
  setInterval(() => {
    Object.values(rooms).forEach(room => {
      room.update();
    });
  }, 200);
}

function getOrCreateRoom(roomId, RoomClass) {
  if (!rooms[roomId]) {
    rooms[roomId] = new RoomClass(roomId);
  }
  return rooms[roomId];
}

module.exports = { startTickLoop, getOrCreateRoom };
