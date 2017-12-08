'use strict';

angular.module('starter.controllers')
  .controller('historialCtrl', function ($scope, api, constants, $state, storage, $rootScope, $stateParams, $timeout, $http, $ionicLoading) {
    $scope.Records  = false;
    $scope.records = [];
    $scope.page = 1;

    $ionicLoading.show({
        content: 'Cargando...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $scope.viewImage = function(){
     cordova.InAppBrowser.open(this.record._payment.data.transaction,  '_blank', 'location=yes');
    }
    
    $scope.load = function(){
        api.credits().add('history').get().success(function(res){
            $scope.records = res || [];
            $scope.Records  = true;
            $ionicLoading.hide();
        });
    }
  });