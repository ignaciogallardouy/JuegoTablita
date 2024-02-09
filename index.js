const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const players = {};

io.on('connection', (socket) => {
  socket.emit('nuevo jugador', { id: socket.id });
  players[socket.id] = {
    id: socket.id,
    x: 100,
    y: 50,
    img: (__dirname, 'client', 'images/platform.png')
  }
  //console.log(players);

  io.emit('updatePlayers', players);

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
    
    // var count = 0;
    // for (player of players) {
    //   if (players.id == socket.id) {
    //     players.splice(count, 1);
    //     break;
    //   }
    //   count += 1;
    // }
  });

  socket.on("JugMovimiento", (socket) => {
    io.emit('movimiento', socket);
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))