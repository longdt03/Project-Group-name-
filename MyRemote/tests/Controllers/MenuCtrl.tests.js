describe('MenuCtrl ', function() {

  var $rootScope, $controllers,
      controller, rootScope;

  //create a fake service
  var $ionicSideMenuDelegate = {
    toggleLeft: function () {}
  };

  beforeEach(function() {
    module('ui.router');
    module('ionic');
    module('one.services');
    module('one.controllers.menu');
    module('firebase');

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');
      //$urlRouterProvider = $injector.get('$urlRouterProvider');
      $scope = {};
          
      controller = $controller('MenuCtrl', {
        '$scope': $scope,
        '$ionicSideMenuDelegate': $ionicSideMenuDelegate
      });
    });
  });

  //here we're going to make sure the $scope variable 
  //exists evaluated.
  it('should have a $scope variable', function() {
      expect($scope).toBeDefined();
  });

  describe ('toggleLeft function', function() {
    it('should be call!', function() {
      // create spy
      spyOn($ionicSideMenuDelegate, 'toggleLeft');
      $scope.toggleLeft ();
      expect($ionicSideMenuDelegate.toggleLeft).toHaveBeenCalled();
    })
  });

  describe ('Camera ', function(){

    it(' devices should be got!', function(){
      var device = {name: 'HIEN'};
      $scope.chooseDevice (device);
      expect($scope.data.selectedDevice.name).toEqual(device.name);
    });

    // it('should have device be chosen ($rootScope)', inject(function($state) {
      
    //   $scope.data.selectedDevice.name = 'HIEN';

    //   $scope.shutdown ();
    //   expect($state.is('shut-down')).toBe(true);
    // }));
  });

});