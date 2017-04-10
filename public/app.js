const app = angular.module('client', ['btford.socket-io']);

app.factory('socket', (socketFactory) => {
  return socketFactory({
    ioSocket: io.connect('/', { transports: ['websocket'] })
  });
});

app.factory('playlist', ($rootScope) => {
  let videos = [];
  let selectedVideo = '';

  return {
    getVideos: function () {
      return videos;
    },
    setVideos: function (data) {
      videos = data;
    },
    getSelectedVideo: function () {
      return selectedVideo;
    },
    setSelectedVideo: function (value) {
      selectedVideo = value;
      $rootScope.$broadcast('setSelectedVideo');
    }
  };
});

app.controller('main', ($scope, socket, playlist) => {
  $scope.videos = playlist.getVideos();
  $scope.selectedVideo = playlist.getSelectedVideo();

  socket.on('setVideos', data => {
    $scope.videos = data;
  });

  $scope.selectVideo = (name) => {
    $scope.selectedVideo = name;
  };

  $scope.$watch('videos', (data, old) => {
    playlist.setVideos(data);
  });

  $scope.$watch('selectedVideo', (name, old) => {
    playlist.setSelectedVideo(name);
  });
});

app.controller('player', ($scope, socket, playlist) => {
  $scope.selectedVideo = playlist.getSelectedVideo();

  $scope.play = () => {

  };

  $scope.pause = () => {

  };

  $scope.$on('setSelectedVideo', (event, args) => {
    $scope.selectedVideo = playlist.getSelectedVideo();
      socket.emit('stopStreaming');
  });
});

app.run((socket) => {
  socket.on('connect', () => {
    socket.emit('getVideos');
  });
});
