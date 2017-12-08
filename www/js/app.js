angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-modal-select', 'ngCordova', 'angular-preload-image', 'ui.utils.masks', 'ngCordovaOauth', 'selectize'])

.run(function($ionicPlatform, $rootScope, $state, $window, constants, storage, $http, $ionicSideMenuDelegate) {
    $rootScope.currency = constants.currency;
    $rootScope.base = constants.uploadFilesUrl;
    $window.moment.locale("es");
    $rootScope.shoppingCart = [];
    $rootScope.user = storage.get('user');
    $rootScope.state = $state;

    $http.get('https://freegeoip.net/json/').success(function(res){
      $rootScope.client_metadata = res || {};
    });

    try{
          window.FirebasePlugin.getToken(function(token) {
              alert(token);
          }, function(error) {
              console.error(error);
          }); 
          
    }catch(e){

    }

    $ionicPlatform.ready(function(){
      navigator.splashscreen.hide();
     
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }

  });

  $rootScope.$on('$stateChangeStart', function(event, nextRoute, toParams, fromState, fromParams, ){
      if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication && !storage.get('token') && !storage.get('access_token')) {
            event.preventDefault();
            $state.transitionTo('home');
      }

      if($ionicSideMenuDelegate._instances.length > 0){
            $ionicSideMenuDelegate._instances[0].close();
      }

      window.sweetAlert.close();
  });
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
     $ionicConfigProvider.tabs.position('bottom');
     $httpProvider.interceptors.push(function($injector, $q) {
        var rootScope = $injector.get('$rootScope');

        return {
            'request': function(config) {
                $httpProvider.defaults.withCredentials = false;
                
                if(window.localStorage.token){
                   $httpProvider.defaults.headers.common['x-daimont-auth'] =  window.localStorage.token ;
                   $httpProvider.defaults.headers.common['x-daimont-user'] =  window.localStorage.uid || null  ; // common
                 }

                 if(window.localStorage.access_token){
                    $httpProvider.defaults.headers.common['access-token'] =  window.localStorage.access_token;
                    $httpProvider.defaults.headers.common['x-daimont-user'] = window.localStorage.user ? angular.fromJson(window.localStorage.user)._id : null // common
                 }

                 
                console.log(config, 'request')
                
                if(config.method == 'POST'){
                    config.data.metadata = config.data.metadata || {}
                    config.data.metadata._author = window.localStorage.uid || null;
                    
                    if(window.localStorage.access_token){
                        config.data.metadata._provider = 'FACEBOOK'; 
                    } 
                  }
                /*for (var x in config.data) {
                    if (typeof config.data[x] === 'boolean') {
                        config.data[x] += '';
                    }
                }*/

                return config || $q.when(config);
            },
            'response': function(response) {
                return response;

            },
            'responseError': function(rejection) {
                 switch(rejection.status){

                    case 401:
                       window.localStorage.clear();
                       delete rootScope.isLogged;
                       delete rootScope.user;
                      return $q.reject(rejection);
                    break;

                    default:
                      return $q.reject(rejection);
                    break;
                 }
                
                return $q.reject(rejection);
            }
        };
    });
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('home', {
      url: '/home',
      templateUrl: 'templates/home/home.html',
      cache:false
  })
    .state('requirements', {
      url: '/requirements',
      templateUrl: 'templates/requirements/requirements.html',
      cache:false
  })
  .state('terms', {
      url: '/terms',
      templateUrl: 'templates/terms/terms.html'
  })
    .state('aboutus', {
      url: '/aboutus',
      templateUrl: 'templates/aboutus/aboutus.html',
      cache:false
  })
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login/login.html',
      cache:false
  })
  .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile/profile.html',
      cache:false
  })
  .state('location', {
        url: '/location',
        access: { requiredAuthentication: true },
        templateUrl: 'templates/profile/location.html'
  })
  .state('reset', {
        url: '/location',
        access: { requiredAuthentication: true },
        templateUrl: 'templates/reset/reset.html'
  })
  .state('finance', {
        url: '/finance',
        access: { requiredAuthentication: true },
        templateUrl: 'templates/profile/finance.html'
  })
  .state('bank', {
        url: '/bank',
        access: { requiredAuthentication: true },
        templateUrl: 'templates/profile/bank.html'
  })
  .state('resumen', {
        url: '/resumen',
        access: { requiredAuthentication: false },
        templateUrl: 'templates/resumen/resumen.html',
        params : {
          form : null
        }
  })
  .state('new_resumen', {
        url: '/new_resumen',
        access: { requiredAuthentication: false },
        templateUrl: 'templates/resumen/new_resume.html',
        params : {
          form : null
        }
  })
  .state('dashboard', {
    url: '/dashboard',
    astract:true,
    access: { requiredAuthentication: true },
    templateUrl: 'templates/dashboard/dashboard.html',
  })
  .state('dashboard.history', {
        url: '/history',
        access: { requiredAuthentication: true },
        templateUrl: 'templates/historial/historial.html',
        views: {
        'tab-history': {
          templateUrl: 'templates/dashboard/tab-history.html',
          controller: 'settingCtrl'
        }
    }
  })
  .state('dashboard.home', {
    url: '/home',
    cache:false,
    access: { requiredAuthentication: true },
    views: {
      'tab-home': {
        templateUrl: 'templates/dashboard/tab-home.html',
        controller: 'settingCtrl'
      }
    }
  })
  .state('dashboard.new', {
    url: '/new',
    access: { requiredAuthentication: true },
    cache:false,
    params: {
      with_offer: null
    },   
    views: {
      'tab-new': {
        templateUrl: 'templates/dashboard/tab-new.html',
        controller: 'settingCtrl'
      }
    }
  })
  .state('resumen_profile', {
        url: '/resumen_profile',
        access: { requiredAuthentication: true },
        templateUrl: 'templates/profile/resumen.html'
  })
  .state('simulator', {
      url: '/simulator',
      templateUrl: 'templates/simulator/simulator.html'
  })
  .state('start', {
      url: '/start',
      templateUrl: 'templates/start/start.html',
      params : {
        form : null
      }
  })
  .state('register', {
      url: '/register',
      templateUrl: 'templates/register/register.html',
      cache:false,
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

}).controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $rootScope, $state, $ionicLoading, api, storage) {
  
  $rootScope.logout = function(){
      delete $rootScope.user;
      delete window.localStorage.token
      delete window.localStorage.access_token;
      delete window.localStorage.user;

      $state.go("home");
  }

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $rootScope.update_cupon = function(){
        swal({
          title: "Ampliar cupo de presamo",
          text: "¿confirma que desea ampliar su cupo de prestamo?",
          type: "info",
          confirmButtonColor: "#008086",
          cancelButtonText: "Cancelar",
          showCancelButton: true,
          closeOnConfirm: false,
          showLoaderOnConfirm: true,
        },
        function(){
         $ionicLoading.show({
            content: 'Cargando...',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
         });

          $rootScope.user.data.cupon = (parseInt($rootScope.cupon.amount) + 100000);
            api.user($rootScope.user._id).put($rootScope.user).success(function(res){
                if(res){
                    storage.update("user", $rootScope.user);
                    $ionicLoading.hide();
                    sweetAlert.close();

                    var confirmPopup = $ionicPopup.confirm({
                       title: 'Cupo aumentado',
                       template: 'Su cupo ha sido aumentado correctamente, ya puedes realizar tu credito por un valor mayor.',
                        scope: $scope,
                        buttons: [
                          {
                            text: '<b>Ok</b>',
                            type: 'button-custom',
                            onTap: function(e) {
                              return true;
                            }
                          }
                        ]
                     });

                    $scope.load();
                }
            });
        });
    }

});
