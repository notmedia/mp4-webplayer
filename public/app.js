const app = angular.module('client', ['btford.socket-io']);

app.factory('socket', (socketFactory) => {
  return socketFactory({
    ioSocket: io.connect('/', { transports: ['websocket'] })
  });
});

app.controller('main', () => {

});

app.controller('video', () => {

});

app.run((socket) => {
  socket.on('connect', () => {
    console.log('connected');
  });
});
