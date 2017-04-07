import express from 'express';
import http from 'http';
import socketio from 'socket.io';

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static('./dist/public'));

io.on('connection', socket => {
});

server.listen(8083);
