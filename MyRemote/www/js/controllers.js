angular.module('myremote.controllers', [])

.controller('LoginCtrl', function($scope, $rootScope, $ionicPopup, $state, $ionicLoading) {
  var usersRef = new Firebase(firebaseUrl);
  
  $scope.login = function(id) {
    if (id) {
      // Loading state
      showLoading();

      // Check if id exist here
      usersRef.child(id).once('value', function(snapshot) {
        hideLoading();
        var isExisted = (snapshot.val() !== null);
        if(isExisted){
          $rootScope.id = id;
          promptPassword();
        } else {
          alert('user' + id + ' do not exist!');
        }
      }, function (err) {
          hideLoading();
          alert(err);
      }); 
    } else {
      alert('Please enter your computer\'s ID.');
    }
    
  };

  var checkPassword = function(password) {
    // Loading state
    showLoading();

    usersRef.child($rootScope.id).child('password').once('value',function(snapshot) {
      hideLoading();

      var isMatched = (snapshot.val() === password);
      if(isMatched){
        $state.go('main-menu');
      } else {
        alert('Password does not match!');
      }
    }, function (err) {
      hideLoading();
      alert(err);
    });
    

  }; 
  
  var promptPassword = function() {
    var promptPopup =   $ionicPopup.prompt({
      title: 'Authentication',
      template: 'Please enter your password.',
      inputType: 'password',
      inputPlaceholder: 'Password'
    });
    promptPopup.then(function(res) {
      if (res) {
        checkPassword(res);
      }
    });
  };

  var showLoading = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    })
  }  

  var hideLoading = function() {
    $ionicLoading.hide();
  }
})

.controller('MenuCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicLoading) {

  $scope.toggleSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.shutdown = function(){
    $state.go('shut-down');    
   };

  $scope.camera = function(){
    $state.go('camera');
  };

   $scope.fileTransfer = function(){
    $state.go('file-transfer');
  };

})

.controller('ShutdownCtrl',function($scope, $state, $rootScope, ShutdownOptions, TimeOptions) {
  $scope.tasks = ShutdownOptions.all();
  $scope.selectedTask = $scope.tasks[0];
  $scope.timeOptions = TimeOptions.all();
  $scope.selectedTime = $scope.timeOptions[0];
  $scope.customTime = 10;

  $scope.submit = function(){
    var userRef = new Firebase(firebaseUrl);
    this.selectedTime.value = (this.selectedTime.other ? this.customTime * 60 : this.selectedTime.value);
    userRef.child($rootScope.id).update({
      data: this.selectedTask.msg + '|' 
            + (this.selectedTask.time? this.selectedTime.value.toString(): '0')
    });
  }

  $scope.back = function() {
    $state.go('main-menu');
  }
})

.controller('CameraCtrl', function($scope,$firebase, $rootScope, $state, $http){
  var ref = new Firebase(firebaseUrl);
  ref.child($rootScope.id).update({data: "capture|photo"});

  $scope.doRefresh = function() {
    ref.child($rootScope.id).child('image').once('value', function(snapshot){
      $scope.data = snapshot.val();
    });
    $scope.$broadcast('scroll.refreshComplete');
    $scope.$apply();
  }
  $scope.back= function() {
    $state.go('main-menu');
  }
});