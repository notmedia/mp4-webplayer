import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';

const app = express();
const server = http.Server(app);
const io = socketio(server, { 'transports': ['websocket'] });

app.use(express.static(path.join(__dirname, '/public')));

io.on('connection', socket => {
  socket.on('getVideos', () => {
    socket.emit('setVideos', [1, 2, 3, 4, 5]);
  });
});

server.listen(8080);
