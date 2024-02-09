const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Estado inicial del juego
let gameState = {
  object1: { x: 100, y: 100, playerId: null },
  object2: { x: 700, y: 100, playerId: null }
};

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

io.on('connection', (socket) => {
  console.log(`Un usuario se ha conectado con el ID: ${socket.id}`);

  // Asignar un objeto a un jugador nuevo
  // Esto es solo un ejemplo, la lógica de asignación debería ser más robusta
  if (!gameState.object1.playerId) {
    gameState.object1.playerId = socket.id;
  } else if (!gameState.object2.playerId) {
    gameState.object2.playerId = socket.id;
  }

  // Enviar el estado actual del juego al nuevo jugador
  socket.emit('estado del juego', gameState);

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado con ID: ${socket.id}`);
    // Liberar el objeto si el jugador se desconecta
    if (gameState.object1.playerId === socket.id) {
      gameState.object1.playerId = null;
    } else if (gameState.object2.playerId === socket.id) {
      gameState.object2.playerId = null;
    }
  });

  socket.on('enviar mensaje', (msg) => {
    io.emit('recibir mensaje', msg);
  });

  // Escuchar los movimientos de los jugadores
  socket.on('mover objeto', (data) => {
    // Actualizar el estado del juego basado en la entrada del jugador
    // Asegúrate de validar la entrada
    if (gameState[data.object].playerId === socket.id) {
      gameState[data.object].x += data.x;
      gameState[data.object].y += data.y;
      // Emitir el nuevo estado a todos los jugadores
      io.emit('estado del juego', gameState);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
