const app = angular.module('client', ['btford.socket-io']);

app.factory('socket', (socketFactory) => {
  return socketFactory({
    ioSocket: io.connect('/', { transports: ['websocket'] })
  });
});

app.controller('main', ($scope, socket) => {
  $scope.videos = [];
  $scope.selectedVideo = '';

  socket.on('setVideos', data => {
    $scope.videos = data;
  });

  $scope.selectVideo = (name) => {
    $scope.selectedVideo = name;
  };
});

app.controller('player', (socket) => {  
});

app.run((socket) => {
  socket.on('connect', () => {
    socket.emit('getVideos');
  });
});
