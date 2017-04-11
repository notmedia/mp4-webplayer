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
    getVideos: () => {
      return videos;
    },
    setVideos: (data) => {
      videos = data;
    },
    getSelectedVideo: () => {
      return selectedVideo;
    },
    setSelectedVideo: (value) => {
      selectedVideo = value;
      $rootScope.$broadcast('selectVideo');
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

app.controller('player', ($rootScope, $scope, socket, playlist) => {
  $scope.selectedVideo = playlist.getSelectedVideo();

  $scope.downloadAndPlay = () => {
    let player = document.querySelector('video');

    let mediaSource = new MediaSource;
    player.src = window.URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', () => {
      let sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
      socket.emit('watchVideo', $scope.selectedVideo);

      socket.on('chunk', (data) => {
        console.log(`${data.name} : chunk`);
        if (data.name == $scope.selectedVideo) {
          sourceBuffer.appendBuffer(data.chunk);          
        }
      });

      socket.on('end', (data) => {
        console.log(`${data.name} : end`);
      });
    });
  };

  $scope.$on('selectVideo', (event, args) => {
    $scope.selectedVideo = playlist.getSelectedVideo();
    let player = document.querySelector('video');
    if (!_.isNil(player)) {
      player.src = '';
      if (!_.isEmpty($scope.selectedVideo)) {
        $scope.downloadAndPlay();
      }
    }    
    socket.removeAllListeners('chunk'); // not working in angular-socket.io
    socket.removeAllListeners('end'); // not working in angular-socket.io
    socket.emit('stopStreaming');
  });
});

app.run((socket) => {
  socket.on('connect', () => {
    socket.emit('getVideos');
  });
});
