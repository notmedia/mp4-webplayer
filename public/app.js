angular.module('app', [
  'ui.router'
]).config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('app', {
    url: '/',
    templateUrl: 'views/index.html'
  });
}).run(() => {

});
