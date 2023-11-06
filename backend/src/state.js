const { ROOM_CODE_MIN, ROOM_CODE_MAX } = require("./constants");
const crypto = require('crypto');

//----------------------------------------------------------------------------------------------------------------------
// Map of all rooms
//----------------------------------------------------------------------------------------------------------------------

const rooms = new Map();

//----------------------------------------------------------------------------------------------------------------------
// Create a new room
//----------------------------------------------------------------------------------------------------------------------

module.exports.createRoom = (socket, data) => {
  let roomCode = 0;
  do {
    roomCode = generateRandomRoomCode();
  } while (rooms.has(roomCode));
  rooms.set(roomCode, {
    ...data,
    roomCode,
    hostSocketId: socket.id,
    players: [],
  });
  return roomCode;
};

function generateRandomRoomCode() {
  const range = ROOM_CODE_MAX - ROOM_CODE_MIN + 1;
  const randomBytes = crypto.randomBytes(4); // 4 bytes for a 32-bit integer range
  const randomNumber = randomBytes.readUInt32LE(0) % range + ROOM_CODE_MIN;
  return randomNumber.toString();
}

//----------------------------------------------------------------------------------------------------------------------
// Retrieve a room by its code
//----------------------------------------------------------------------------------------------------------------------

module.exports.getRoom = (roomCode) => rooms.get(roomCode);

//----------------------------------------------------------------------------------------------------------------------
// Count the number of rooms
//----------------------------------------------------------------------------------------------------------------------

module.exports.getRoomCount = () => rooms.size;

//----------------------------------------------------------------------------------------------------------------------
// Delete a room
//----------------------------------------------------------------------------------------------------------------------

module.exports.deleteRoom = (roomCode) => rooms.delete(roomCode);

//----------------------------------------------------------------------------------------------------------------------
// Get the host's socket
//----------------------------------------------------------------------------------------------------------------------

module.exports.getHostSocket = (io, roomCode) => {
  const room = rooms.get(roomCode);
  return room && room.hostSocketId
    ? io.sockets.sockets.get(room.hostSocketId)
    : undefined;
};
