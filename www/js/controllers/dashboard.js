angular.module('starter.controllers').controller('dashboardCtrl', function ($scope, api, storage, $state, $rootScope, $timeout, $http, $stateParams, $filter, $ionicPopup, $ionicLoading, $ionicModal, $ionicSideMenuDelegate) {
    $scope.current_date = new Date();
    
    $ionicModal.fromTemplateUrl('templates/modals/banks.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
      $rootScope.bank_selected = true;
          if($rootScope.signed){
            delete $rootScope.signed;
          }
          $rootScope.hide_note = true;
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

    $scope.form = {};
    $scope.form.data = {};
    
    if($stateParams.form && $stateParams.form.data){
      $scope.form.data = $stateParams.form.data
    }

    $scope.form.data.finance_quoteFixed = 12990;
    $scope.form.data.finance_quoteChange = 960;
    
    $scope.items_tasks = [];
    $scope.current_credit = false;
    $scope.with_offer = false;
    $scope.records = [];
    $scope.Records  = false;
    $scope.have_contract = false;
    $scope.is_transfered = false;
  
    $scope.alerts = [
      { type: 'primary'}
    ];

    try{
      $rootScope.$on('CREDIT_UPDATED_LOCAL', function(evt, data){
        $scope.load();
      });

    }catch(e){

    }

    $scope.viewImage = function(){
     cordova.InAppBrowser.open($scope.current_credit._payment.data.transaction,  '_blank', 'location=yes');
    }


    $scope.go_to  = function(state_name, data){
      $state.go(state_name, { form : data });
    }


    $scope.closeAlert = function(index) {
       $scope.alerts.splice(index, 1);
    };

    $scope.load = function(){
      $ionicLoading.show({
        content: 'Cargando...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      if($rootScope.user){
            try{
                  window.socket.emit("MAIN", $rootScope.user._id);
            }catch(e){
    
            }
      }

      if($stateParams.signed){
            $scope.signed = true;
            delete $scope.without_offer;
      }

      if($stateParams.with_offer){
            $scope.with_offer = true;
      }

      api.credits().add("max_amount").get().success(function(res){
          $rootScope.cupon = res || [];
      }).error(function(){
            $ionicLoading.hide();
      });

      api.credits().add('current').get().success(function(res){
            $scope.Records  = true;
            $scope.records = res.length == 0 || res.data.with_offer ? [] : [res];
            $scope.current_credit = $scope.records[0] || undefined; 
            $ionicLoading.hide();
            if($scope.current_credit){
                $scope.have_contract = $scope.current_credit._contract || false;
                $scope.is_transfered = ($scope.current_credit.data.status =='Consignado');
            }else{
                if($scope.with_offer){
                  $state.go('dashboard.new');
                }else{
                    $state.go('dashboard');
                }

                return;
            }

            if($scope.current_credit){
                $scope.early_payment();
            }
      }).error(function(){
        $scope.Records = true;
        $scope.records.length = 0;
        $ionicLoading.hide();
      });

      api.payments().get().success(function(res){
            $scope.payments = res || [];  
      });
        try{
              $scope.form.data.pay_day = $scope.pay_day($scope.form.data.days[0]).toISOString();
        }catch(e){
          
        }

    }

    $scope.delete_credit = function(){
      var myPopup = $ionicPopup.show({
         title: 'Eliminar préstamo',
         subTitle: '¿confirma que desea eliminar este préstamo?',
         scope: $scope,
      
         buttons: [
            { text: 'NO' }, {
               text: 'SI',
               type: 'button-custom',
               onTap: function(e) {
                    $scope.current_credit.data.hidden = true;
                    api.credits($scope.current_credit._id).put($scope.current_credit).success(function(res){
                      if(res){
                          $scope.records.length = 0;
                          delete $scope.current_credit;
                          delete $scope.signed;

                          if($scope.isNew){
                              $scope.isNew = false;
                          }

                          $scope.load();

                          $scope.$apply();
                      } 
                    });
               }
            }
         ]
      });
    }

    $scope.update_cupon = function(){
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

    $scope.confirm = function(){
        var data = {};
        data._user = $rootScope.user._id;
        data._credit = $scope.current_credit._id;
         $ionicLoading.show({
            content: 'Cargando...',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
         });
        api.contracts().post(data).success(function(res){
          $ionicLoading.hide();
            if(res){
                  swal({
                    title: "Firmar Contrato",
                    text: "Revisa tu correo bandeja de entrada o correo no deseado y usa el codigo de 6 caracteres que te hemos enviado.",
                    type: "input",
                    confirmButtonColor: "#008086", 
                    confirmButtonText: "Firmar",
                    cancelButtonText: "Cancelar",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Escribe el codigo de 6 caracteres"
                  },
                  function(inputValue){
                    if (inputValue === false) return false;
                    
                    if (inputValue === "") {
                      swal.showInputError("Tu firma es incorrecta!");
                      return false
                    }

                    api.contracts().add("verify/" + inputValue).get().success(function(res){
                      if(res){
                            if(res.length == 0 ){
                              swal.showInputError("Tu firma es incorrecta!");
                            }else{
                                  $scope.current_credit._contract = res._id;
                                  $scope.current_credit.data.status = 'Firmado';

                                  api.credits($scope.current_credit._id).put($scope.current_credit).success(function(response){
                                      if(response){
                                          swal("Contrato Firmado!", "Usted ha firmado correctamente. Su solicitud de crédito sera revisada lo mas pronto posible, de ser aprobado el crédito, se realizara el desombolso en 12 horas hábiles, de ser rechazado su crédito los contratos se anulan y puede volver a solicitar un crédito nuevamente  en 60 días", "success")
                                          $scope.isNew = true;
                                          $rootScope.hide_note = true;
                                          $rootScope.signed = true;

                                          delete $rootScope.bank_selected;
                                          delete $rootScope.bank_obj;
                                          
                                          $scope.load();
                                          window.scrollTo(0, 0);
                                      }
                                  });
                            }
                      }
                    });

                  });  
            }
        });


    }

     $scope.inc_amount_md = function(){
            var _current_amount = $scope.amount_instance_md.get();
            var steps = $scope.amount_instance_md.options.step;
            var value = (parseInt(_current_amount) + steps);

            $scope.amount_instance_md.set(value);
      }

      $scope.dec_amount_md = function(){
          var _current_amount = $scope.amount_instance_md.get();
          var steps = $scope.amount_instance_md.options.step;
          var value = (parseInt(_current_amount) - steps);

          $scope.amount_instance_md.set(value);
      }

      $scope.inc_days_md = function(){
          var _current_day = $scope.days_instance_md.get();
          var steps = $scope.days_instance_md.options.step;
          var value = (parseInt(_current_day) + steps);

          $scope.days_instance_md.set(value); 

      }

      $scope.dec_days_md = function(){
          var _current_day = $scope.days_instance_md.get();
          var steps = $scope.days_instance_md.options.step;
          var value = (parseInt(_current_day) - steps);

          $scope.days_instance_md.set(value); 
      }

      $scope.inc_amount_mv = function(){
            var _current_amount = $scope.amount_instance_mv.get();
            var steps = $scope.amount_instance_mv.options.step;
            var value = (parseInt(_current_amount) + steps);

            $scope.amount_instance_mv.set(value);        
      }

      $scope.dec_amount_mv = function(){
          var _current_amount = $scope.amount_instance_mv.get();
          var steps = $scope.amount_instance_mv.options.step;
          var value = (parseInt(_current_amount) - steps);

          $scope.amount_instance_mv.set(value);      
      }

      $scope.inc_days_mv = function(){
          var _current_day = $scope.days_instance_mv.get();
          var steps = $scope.days_instance_mv.options.step;
          var value = (parseInt(_current_day) + steps);

          $scope.days_instance_mv.set(value);  
      }

      $scope.dec_days_mv = function(){
          var _current_day = $scope.days_instance_mv.get();
          var steps = $scope.days_instance_mv.options.step;
          var value = (parseInt(_current_day) - steps);

          $scope.days_instance_mv.set(value);  
      }


    $scope.$watch('new_payment_form.transaction', function(o, n){
      if(n){
           var confirmPopup1 = $ionicPopup.confirm({
               title: 'Está Seguro?',
               template: 'Confirma que has realizado el pago ?',
              scope: $scope,
              buttons: [
                {
                  text: '<b>Ok</b>',
                  type: 'button-custom',
                  onTap: function(e) {
                    $scope.new_payment();

                    return true;
                  }
                },
                {
                  text: '<b>Cancelar</b>',
                  onTap: function(e) {
                    return false;
                  }
                }
              ]
            });
          }

      if(o){
           var confirmPopup2 = $ionicPopup.confirm({
               title: 'Está Seguro?',
               template: 'Confirma que has realizado el pago ?',
              scope: $scope,
              buttons: [
                {
                  text: '<b>Ok</b>',
                  type: 'button-custom',
                  onTap: function(e) {
                    $scope.new_payment();
                    return true;
                  }
                },
                {
                  text: '<b>Cancelar</b>',
                  onTap: function(e) {
                    return false;
                  }
                }
              ]
            });
      }
    });

    $scope.toFormData = function(obj, form, namespace) {
        var fd = form || new FormData();
        var formKey;
        
        for(var property in obj) {
          if(obj.hasOwnProperty(property) && obj[property]) {
            if (namespace) {
              formKey = namespace + '[' + property + ']';
            } else {
              formKey = property;
            }
           
            // if the property is an object, but not a File, use recursivity.
            if (obj[property] instanceof Date) {
              fd.append(formKey, obj[property].toISOString());
            }
            else if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
              $scope.toFormData(obj[property], fd, formKey);
            } else { // if it's a string or a File object
              fd.append(formKey, obj[property]);
            }
          }
        }
        
        return fd;
    }

    $scope.detail = function(){
      $state.go('detail', { credit : this.record._id } );
    }

    $scope.show_banks = function(){
      $scope.openModal();
      /*window.modal = modal.show({templateUrl : 'views/dashboard/payment.html', size:'lg', scope: this, backdrop: true, show : true, keyboard  : true}, function($scope){
          $rootScope.bank_selected = true;
          
          if($rootScope.signed){
            delete $rootScope.signed;
          }

          $rootScope.hide_note = true;
          $scope.$close();
      }); */
    }

    $scope.show_details = function(){
        $scope.show_detail = $scope.show_detail ? false : true;
    }

    $scope.new_payment = function(){
      $scope.new_payment_form.data = $scope.paymentForm;
      $scope.new_payment_form.data.bank = $rootScope.bank_obj;
      $scope.new_payment_form._credit = $scope.current_credit._id;
      $scope.new_payment_form._user = $rootScope.user._id;
         
         $ionicLoading.show({
            content: 'Cargando...',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
         });

      api.payments().post($scope.toFormData($scope.new_payment_form), {
        transformRequest: angular.identity,
        headers: {'Content-Type':undefined, enctype:'multipart/form-data'}
        }).success(function(res){
              
              if(res){
                  $scope.current_credit._payment = res._id;
                  $scope.current_credit._contract = $scope.current_credit._contract._id || null;
                  $scope.current_credit.data.status = 'Pagado';
                  api.credits($scope.current_credit._id).put($scope.current_credit).success(function(response){
                    if(response){

                      $ionicLoading.hide()
                         var confirmPopup = $ionicPopup.confirm({
                             title: 'Pago Enviado!',
                             template: 'Has enviado la evidencia de pago correctamente. Este pago esta sujeto a verificación.',
                            scope: $scope,
                            buttons: [
                              {
                                text: '<b>Ok</b>',
                                type: 'button-custom',
                                onTap: function(e) {
                                  return true;
                                  window.scrollTo(0,0);
                                }
                              }
                            ]
                          });

                      delete $rootScope.bank_selected;
                    }
                });

                  $scope.load();
              }
        });
    }

    $scope.add_to_task = function(){
      if(this.record.add){
        $scope.items_tasks.push(this.record._id);
      }else{
        $scope.items_tasks.splice($scope.items_tasks.indexOf(this.record._id), 1);
      }
    }

    $scope.new_credit = function(){

      $scope.form._user = storage.get('uid') || $rootScope.user._id;
      $scope.form.data.client_metadata = $rootScope.client_metadata || {};
      $scope.form.data.status = 'Pendiente';
      $scope.form.owner = storage.get('uid') || $rootScope.user._id;

         $ionicLoading.show({
            content: 'Cargando...',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
         });

      api.credits().post($scope.form).success(function(res){
        if(res){
              api.credits().add("current").get().success(function(res){
                  if(res){
                      api.credits().add("email_request/" + res._id).get().success(function(res){
                        if(res){
                          $ionicLoading.hide();
                            var confirmPopup = $ionicPopup.confirm({
                                title: 'Préstamo Solicitado',
                                template: "Enviamos un correo con el resumen del crédito, por favor léalo cuidadosamente antes de realizar la firma electrónica, el correo puede llegar en su bandeja de entrada o correo no deseado.",
                                scope: $scope,
                                buttons: [
                                  {
                                    text: '<b>Ok</b>',
                                    type: 'button-custom',
                                    onTap: function(e) {
                                      $scope.isNew = true;
                                      $scope.isDone = true;
                                      $scope.with_offer = false;
                                      $rootScope.hide_offert = true;
                                      delete $rootScope.bank_obj;
                                      $state.go('dashboard.home', { without_offer : true });
                                      $scope.load();
                                      window.scrollTo(0,0);
                                      
                                      return true;
                                    }
                                  }
                                ]
                             });
                        }
                      });                                                   
                  }
              })
        } 
      });

    }

    $scope.upload_consignacion_bancaria = function(){
      
          if(!$rootScope.bank_obj){
                swal({
                  title: "Selecciona un banco.",
                  text: "Por favor selecciona un banco donde realizaste tu pago ó donde deseas pagar.",
                  type: "info",
                  showCancelButton: false,
                  confirmButtonColor: "#008086",
                  confirmButtonText: "Ok",
                  closeOnConfirm: true
                },
                function(){
                  $scope.show_banks();
                });

                return;
          }

        $scope.paymentForm.payment_type = 'Consignación';
        $('#consignacion_bancaria').click();
    }


    $scope.upload_transacion_bancaria = function(){
          if(!$rootScope.bank_obj){
                swal({
                  title: "Selecciona un banco.",
                  text: "Por favor selecciona un banco donde realizaste tu pago ó donde deseas pagar.",
                  type: "info",
                  showCancelButton: false,
                  confirmButtonColor: "#008086",
                  confirmButtonText: "Ok",
                  closeOnConfirm: true
                },
                function(){
                  $scope.show_banks();
                });

                return;
          }

          $scope.paymentForm.payment_type = 'Transferencia';
          $('#transaccion_bancaria').click();
    }

    $scope.early_payment = function(){
      $scope.paymentForm = {};

      console.log("deposited_time", $scope.current_credit.data.deposited_time)
      console.log("payday", $scope.current_credit.data.pay_day)

      var system = moment($scope.current_credit.data.deposited_time_server);
      var now = moment(new Date().toISOString());

      $scope.payForDays  = now.diff(system, 'days') == 0 ? 1 : now.diff(system, 'days');

      $scope.paymentForm.interests = (parseInt($scope.current_credit.data.amount[0]) * (2.18831289 / 100));

      $scope.paymentForm.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * $scope.payForDays);
      $scope.paymentForm.iva = $scope.paymentForm.system_quote * (19 / 100);
      
      $scope.paymentForm.interestsPeerDays = ( angular.copy($scope.paymentForm.interests) / 30 );
      $scope.paymentForm.interestsDays = ($scope.paymentForm.interestsPeerDays ) * $scope.payForDays;
      
      $scope.totalizePayment();        

    }

    $scope.totalizePayment = function(){
      $scope.paymentForm.total_payment = (parseInt($scope.current_credit.data.amount[0])) + ($scope.paymentForm.interestsDays) + ($scope.paymentForm.system_quote || 0) + ($scope.paymentForm.iva || 0);
    }

    $scope.logout = function(){
      window.localStorage.clear();
      
      delete $rootScope.isLogged;
      delete $rootScope.user;

      $state.go('home');
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

        }

        if(o){
            $scope.form.data.pay_day = $scope.pay_day(o[0]); 
            $scope.form.data.interestsPeerDays = ( angular.copy($scope.form.data.interests) / 30 );
            $scope.form.data.interestsDays = $scope.form.data.interestsPeerDays * o[0];

            $scope.form.data.system_quote = ($scope.form.data.finance_quoteFixed + $scope.form.data.finance_quoteChange * o[0]);
            $scope.form.data.ivaPeerdays = (angular.copy($scope.form.data.iva) / 30);
            $scope.form.data.ivaDays = ($scope.form.data.finance_quote + $scope.form.data.system_quoteDays || $scope.form.data.system_quote ) * (19 / 100);
            
            $scope.totalize();      
        }
    });

    $scope.$watch('form.data.amount', function(o, n){
        var message;

        if(n){

              if(n[0] >= ($rootScope.user.data.cupon || 300000) && !$scope.show_warning_msg){
                    $scope.show_warning_msg = true;
              }else {
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
        }

        if(o){

              if(o[0] >= ($rootScope.user.data.cupon || 300000) && !$scope.show_warning_msg){
                    $scope.show_warning_msg = true;
              }else{
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
        }
    });
  
  });
