angular.module('beerOrderingApp', ['ui.router', 'checklist-model'])
  .config([
    '$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/menu');
      $stateProvider
        .state('contact', {
          url: '/contact',
          cache: false,
          templateUrl: 'app/src/contactview.html',
          controller: 'ContactController as vm'
        })
        .state('about', {
          url: '/about',
          cache: false,
          templateUrl: 'app/src/aboutview.html',
          controller: 'AboutController as vm'
        })
        .state('menu', {
          url: '/menu',
          cache: false,
          templateUrl: 'app/src/menuview.html',
          controller: 'MenuController as vm'
        });
    }])
  .controller('ContactController', ['$scope', function ($scope) {
    var vm = this;
  }])
  .controller('AboutController', ['$scope', function ($scope) {
    var vm = this;
  }])
  .controller('MenuController', ['BeersService', '$timeout', function (BeersService, $timeout) {
    var vm = this;
    vm.beers = [];
    vm.styles = [];
    vm.selectedStyles = [];
    vm.filteredBeers = [];
    vm.listLoaded = false;
    vm.loader = false;
    getBeersMenu();

    vm.styleSelected = function (style) {
      vm.loader = true;
      $timeout(function () {
        vm.beers = _.filter(vm.beers, function (beer) {
          return vm.selectedStyles.includes(beer.style);
        });
        if (vm.selectedStyles.length === 0) {
          getBeersMenu();
        }
        vm.loader = false;
      });
    };

    function getBeersMenu() {
      BeersService.getBeersMenu().then(function (response) {
        vm.beers = response;
        vm.styles = _.flatMap(_.uniqBy(vm.beers, 'style'), 'style');
        vm.listLoaded = true;
      });
    }
  }])
  .service('BeersService', function ($http) {
    return {
      getBeersMenu: function () {
        return $http({
          method: 'GET',
          url: 'http://starlord.hackerearth.com/beercraft',
          cache: true
        })
          .then(function (response) {
            return response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    };
  });

angular.bootstrap(document, ['beerOrderingApp']);