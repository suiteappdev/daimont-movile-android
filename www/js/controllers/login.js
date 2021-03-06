angular.module('starter.controllers').controller('loginCtrl', function($scope, $http, constants, account, storage, $ionicPopup, $state, $rootScope, $cordovaOauth, api){
    $scope.load = function(){
        if(window.localStorage.token || window.localStorage.access_token){
            if($rootScope.user.data.updated){
                $state.go(constants.login_state_sucess);
            }else{
                $state.go("profile");
            }
        }
    }

    $scope.me = function(callback, error) {
        if(window.localStorage.access_token) {
          $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: window.localStorage.access_token, fields: "id, name, last_name, gender, location, website, picture, email", format: "json" }}).success(callback).error(error);
        } 
    };

    $scope.login = function(){
      if($scope.loginForm.$invalid){
            modal.incompleteForm();
            return;
      }

        var _success = function(res){
          if(res.user.type == "CLIENT"){
              var  _user =  res.user;
              var  _token = res.token;
              storage.save('token', _token);
              storage.save('user', _user);
              storage.save('uid', _user._id);
              $rootScope.isLogged = true;
              $rootScope.user = storage.get('user');

              if(!res.user.data.updated){
                  $state.go('profile');
              }else{
                  if($rootScope.signed){
                      delete $rootScope.signed;
                   }

                  $state.go("dashboard.home", {reload:true});          
              }

          }else if(res.user.type == "ADMINISTRATOR"){
              var  _user =  res.user;
              var  _token = res.token;
              storage.save('token', _token);
              storage.save('user', _user);
              storage.save('uid', _user._id);
              $rootScope.isLogged = true;
              $rootScope.user = storage.get('user');
              $state.go("credits", { status : 'firmado' });          
          }else{
              var confirmPopup = $ionicPopup.confirm({
                 title: 'Error de inicio de session!',
                 template: 'Privilegio insuficiente',
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
            $scope.unprivileged = true;
          }
        };

        var _error = function(data){
          if(data.status == 401){
            var confirmPopup = $ionicPopup.confirm({
                 title: 'Datos incorrectos',
                 template: 'Contraseña incorrecta',
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
          }

          if(data.status == 404){
            var confirmPopup = $ionicPopup.confirm({
                 title: 'Email no encontrado!',
                 template: 'no existe un usuario registrado con este email!',
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
          }
        };

        account.usuario().ingresar($scope.form.data).then(_success, _error); 
    }

    $scope.facebook_login_default = function() {
      if(window.localStorage.access_token){
            $state.go("dashboard.home");
            return;
      }

      var _success = function(data){
        if(data){
              $scope.me(function(data){
                api.user().add("facebook/" + data.id.toString()).get().success(function(res){
                    if(res != null){
                        $rootScope.isLogged = true;
                        $rootScope.user = res;
                        $rootScope.medata = res;

                        window.localStorage.user = JSON.stringify(res);
                        
                        if(!res.data.updated){
                              $state.go('profile');
                          }else{
                             if($rootScope.signed){
                                delete $rootScope.signed;
                             }
                             
                             $state.go("dashboard.home");          
                          }

                          $scope.$apply();
                    }
                });
              }, function(err){
                alert("error" + err);
              }); 
        }
      };

      var _error = function(data){
        if(data.status == 409){
                      $scope.me(function(data){
                        api.user().add("facebook/" + data.id.toString()).get().success(function(res){
                                $rootScope.isLogged = true;
                                $rootScope.user = res;
                                window.localStorage.user = JSON.stringify(res);

                                if(!res.data.updated){ 
                                      $state.go('profile');
                                  }else{
                                     if($rootScope.signed){
                                        delete $rootScope.signed;
                                     }

                                      $state.go("dashboard.home");          
                                  }

                                  $scope.$apply();
                        });
                      }, function(err){
                        alert(err)
                      });   
          }
      };

        $cordovaOauth.facebook("448351572192242", ["email", "public_profile"]).then(function(result) {
            if(result.access_token){
                var fb_token = result.access_token;
                window.localStorage.access_token = fb_token;

                  $scope.me(function(data){
                          var new_user = {};
                          new_user.data = {};
                          new_user.metadata  = {};
                          new_user.data._provider = 'FACEBOOK';
                          new_user.data.facebookId  = data.id;
                          new_user.name = data.name;
                          new_user.type = 'CLIENT';
                          new_user.data.picture = data.picture.data.url;
                          new_user.last_name = data.last_name;
                          new_user.email = data.email;

                          $rootScope.me = new_user;
                  
                            if($rootScope.credit){
                                var _credit = {};
                                _credit.data = $rootScope.credit.data;
                                _credit.data.client_metadata = $rootScope.client_metadata || {};
                                _credit.data.status = 'Pendiente';
                                new_user.credit = _credit;
                            }

                          account.usuario().register(new_user).then(_success, _error);  
                }, function(err){
                  alert("error " +  err);
                });  
            }

        }, function(error) {
           alert("error " +  error);
        });
    };
})