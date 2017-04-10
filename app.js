import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';
import videos from './src/helpers/videos';

const app = express();
const server = http.Server(app);
const io = socketio(server, { 'transports': ['websocket'] });

app.use(express.static(path.join(__dirname, '/public')));

io.on('connection', socket => {
  socket.on('getVideos', () => {
    videos.get('videos', (error, files) => {
      socket.emit('setVideos', files);
    });
  });

  socket.on('watchVideo', name => {
    const stream = videos.watch('videos', name);

    stream.on('data', chunk => {
      socket.emit('chunk', { chunk, name });
    });

    stream.on('end', () => {
      socket.emit('end', { name });
    });

    socket.on('stopStreaming', () => {
      stream.close();
    });
  });
});

server.listen(8080);
