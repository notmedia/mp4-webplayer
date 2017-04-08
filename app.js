import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';

const app = express();
const server = http.Server(app);
const io = socketio(server, { 'transports': ['websocket'] });

app.use(express.static(path.join(__dirname, '/public')));

io.on('connection', socket => {
  console.log('connection succeeded');
});

server.listen(8080);
