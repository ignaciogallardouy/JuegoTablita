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
  console.log('Un usuario se ha conectado');
  players[socket.id] = {
    x: 100,
    y:50,
    img: (__dirname, 'client', 'images/platform.png')
  }
  console.log(players);

  io.emit('updatePlayers', players);

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });

  socket.on("JugMovimiento", (socket) => {
    io.emit('movimiento', socket);
  });

  // socket.on("AddNewBall", (newuser) => {
  //   io.emit('newBall',newuser);
  // });

  // socket.on('enviar mensaje', (msg) => {
  //   io.emit('recibir mensaje', msg);
  // });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))