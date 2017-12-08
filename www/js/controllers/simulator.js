angular.module('starter.controllers').controller('simulatorCtrl', function($scope, constants, account, storage, $ionicPopup, $state, $rootScope, $stateParams){

    $scope.form = {};
    $scope.form.data = {};
    $scope.form.data.finance_quoteFixed = 12990;
    $scope.form.data.finance_quoteChange = 960;
    $scope.current_date = new Date();

    $scope.load = function(){
    	if($stateParams.form){
    		$scope.form = $stateParams.form;
    	}

      if(window.localStorage.token || window.localStorage.access_token){
         $state.go("dashboard.home");
      }
    }

    $scope.go_to  = function(state_name, data){
    	$state.go(state_name, { form : data });
    }

    $scope.inc_amount = function(){
        var _current_amount = $scope.amount_instance.get();
        var steps = $scope.amount_instance.options.step;
        var value = (parseInt(_current_amount) + steps);

        $scope.amount_instance.set(value);        
    }

    $scope.dec_amount = function(){
        var _current_amount = $scope.amount_instance.get();
        var steps = $scope.amount_instance.options.step;
        var value = (parseInt(_current_amount) - steps);

        $scope.amount_instance.set(value);      
    }

    $scope.inc_days = function(){
        var _current_day = $scope.days_instance.get();
        var steps = $scope.days_instance.options.step;
        var value = (parseInt(_current_day) + steps);

        $scope.days_instance.set(value);  
    }

    $scope.dec_days = function(){
        var _current_day = $scope.days_instance.get();
        var steps = $scope.days_instance.options.step;
        var value = (parseInt(_current_day) - steps);

        $scope.days_instance.set(value);  
    }

    $scope.pay_day = function (days){
      var today = new Date();

      return  new Date(today.getTime() + (days * 24 * 3600 * 1000));
    }

    $scope.totalize = function(){
      $scope.form.data.total_payment = ($scope.form.data.amount[0]) + ($scope.form.data.interestsDays || $scope.form.data.interests) + ($scope.form.data.system_quote || $scope.form.data.system_quote || 0) + ($scope.form.data.ivaDays || $scope.form.data.iva || 0) + ( $scope.form.data.finance_quote || 0);
    }

    $scope.$watch('form.data.days', function(o, n){
        if(n){
            $scope.form.data.pay_day = $scope.pay_day(n[0]); 
            $scope.form.data.interestsPeerDays = ( angular.copy($scope.form.data.interests) / 30 );
            $scope.form.data.interestsDays = ($scope.form.data.interestsPeerDays) * n[0];
            $scope.form.data.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * n[0]);
            $scope.form.data.ivaPeerdays = (angular.copy($scope.form.data.iva) / 30);
            $scope.form.data.ivaDays = ($scope.form.data.finance_quote + $scope.form.data.system_quoteDays || $scope.form.data.system_quote ) * (19 / 100);
            
            $scope.totalize();

            $rootScope.credit = $scope.form;      

        }

        if(o){
            $scope.form.data.pay_day = $scope.pay_day(o[0]); 
            $scope.form.data.interestsPeerDays = ( angular.copy($scope.form.data.interests) / 30 );
            $scope.form.data.interestsDays = $scope.form.data.interestsPeerDays * o[0];

            $scope.form.data.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * o[0]);
            $scope.form.data.ivaPeerdays = (angular.copy($scope.form.data.iva) / 30);
            $scope.form.data.ivaDays = ($scope.form.data.finance_quote + $scope.form.data.system_quoteDays || $scope.form.data.system_quote ) * (19 / 100);
            
            $scope.totalize();

            $rootScope.credit = $scope.form;      
        }
    });

    $scope.$watch('form.data.amount', function(o, n){
        if(n){
              if(n[0] >= 300000 ){
                    $scope.show_warning_msg = true;
              }else if(n[0] <= 300000 ){
                    $scope.show_warning_msg = false;
              }

              $scope.form.data.interests = (n[0] * (2.18831289 / 100));
              $scope.form.data.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.form.data.days[0]);
              $scope.form.data.iva = (($scope.form.data.system_quote + $scope.form.data.finance_quote) * (19 / 100));
              
              $scope.form.data.interestsPeerDays = ( angular.copy($scope.form.data.interests) / 30 );
              $scope.form.data.interestsDays = ($scope.form.data.interestsPeerDays) * $scope.form.data.days[0];

              $scope.form.data.system_quotePeerDays = (angular.copy($scope.form.data.system_quote) / 30 ); 
              $scope.form.data.system_quoteDays = ($scope.form.data.system_quotePeerDays) * ($scope.form.data.days[0]);

              $scope.form.data.ivaPeerdays = (angular.copy($scope.form.data.iva) / 30);
              $scope.form.data.ivaDays = ($scope.form.data.finance_quote + $scope.form.data.system_quoteDays ||  $scope.form.data.system_quote  ) * (19 / 100);
              $scope.totalize();

              $rootScope.credit = $scope.form;      
        }

        if(o){
              if(o[0] >= 300000 ){
                    $scope.show_warning_msg = true;
              }else if(o[0] <= 300000 ){
                    $scope.show_warning_msg = false;
              }
              $scope.form.data.interests = (o[0] * (2.18831289 / 100));
              $scope.form.data.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.form.data.days[0]);

              $scope.form.data.iva = (($scope.form.data.system_quote + $scope.form.data.finance_quote) * (19 / 100));
              
              $scope.form.data.interestsPeerDays = ( angular.copy($scope.form.data.interests) / 30 );
              $scope.form.data.interestsDays = ($scope.form.data.interestsPeerDays) * $scope.form.data.days[0];

              $scope.form.data.system_quotePeerDays = (angular.copy($scope.form.data.system_quote) / 30 ); 
              $scope.form.data.system_quoteDays = ($scope.form.data.system_quotePeerDays) * ($scope.form.data.days[0]);

              $scope.form.data.ivaPeerdays = (angular.copy($scope.form.data.iva) / 30);
              $scope.form.data.ivaDays = ($scope.form.data.finance_quote + $scope.form.data.system_quoteDays ||  $scope.form.data.system_quote  ) * (19 / 100);
              $scope.totalize();

              $rootScope.credit = $scope.form;       
        }
    });

})