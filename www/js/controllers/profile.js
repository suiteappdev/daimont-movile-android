angular.module('starter.controllers').controller('profileCtrl', function ($scope, api, constants, $state, storage, account, $rootScope, $stateParams, $timeout, $http, $ionicPopup) {
    $scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    $scope.months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    
    $scope.years = [];

    for(var i = 1910; i < 2017; i++){
        $scope.years.push(i)
    }
    
    $scope.theDate = new Date();
    $scope.selectedyear = $scope.theDate.getFullYear();
    $scope.selectedmonth = $scope.months[$scope.theDate.getMonth()];
    $scope.selectedday = $scope.theDate.getDay();  
    $scope.old_cc = angular.copy($rootScope.user.cc);

 $scope.cuentas_bancarias = {
        plugins: ['hidden_textfield'],
        create:false, maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'¿Cuántas cuentas bancarias tiene usted?'
    };

    $scope.sexo = {
        plugins: ['hidden_textfield'],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Sexo' 
    };

    $scope.tarjetas_credito = {
            plugins: ['hidden_textfield'],
            create:false,
            maxItems:1,
            valueField: 'value',
            labelField: 'text',
            placeholder:'¿Tiene tarjetas de crédito?'
    };

    $scope.tipo_cuenta = {
        plugins: ['hidden_textfield'],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Tipo de cuenta'
    };

    $scope.nivel_estudio = {
        plugins: ['hidden_textfield'],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Nivel de Estudio'
    }; 

    $scope.role = {
        plugins:['hidden_textfield'],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Actualmente soy'
    };

    $scope.vivienda = {
        plugins: ['hidden_textfield'],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Tipo de vivienda' 
    };

    $scope.estrato = {
        plugins: ['hidden_textfield'],
        create:false,
        maxItems:1,
        valueField: 'value',
        labelField: 'text',
        placeholder:'Estrato'
    }

    
    $scope.ingresos_records = [
                        {number:500000,  value:"Menos de 500.000", text:"Menos de 500.000"},
                        {number:500001,  value:"De 500.000 hasta 1.000.000", text:"De 500.000 hasta 1.000.000"},
                        {number:1000001, value:"De 1.000.001 hasta 1.500.000", text:"De 1.000.001 hasta 1.500.000"},
                        {number:1500001, value:"De 1.500.001 hasta 2.000.000", text:"De 1.500.001 hasta 2.000.000"},
                        {number:2000001, value:"De 2.000.001 hasta 2.500.000", text:"De 2.000.001 hasta 2.500.000"},
                        {number:2500001, value:"De 2.500.001 hasta 3.000.000", text:"De 2.500.001 hasta 3.000.000"},
                        {number:3000001, value:"De 3.000.001 hasta 3.500.000", text:"De 3.000.001 hasta 3.500.000"},
                        {number:3500001, value:"De 3.500.001 hasta 4.000.000", text:"De 3.500.001 hasta 4.000.000"},
                        {number:4000001, value:"De 4.000.001 hasta 4.500.000", text:"De 4.000.001 hasta 4.500.000"},
                        {number:4500001, value:"De 4.500.001 hasta 5.000.000", text:"De 4.500.001 hasta 5.000.000"},
                        {number:5000001, value:"De 5.000.001 hasta 5.500.000", text:"De 5.000.001 hasta 5.500.000"},
                        {number:5500001, value:"De 5.500.001 hasta 6.000.000", text:"De 5.500.001 hasta 6.000.000"},
                        {number:7000001, value:"De 6.000.001 en adelante", text:"De 6.000.001 en adelante"}
                    ];

    $scope.egresos_records = [
                        {number:500000,  value:"Menos de 500.000", text:"Menos de 500.000"},
                        {number:500001,  value:"De 500.000 hasta 1.000.000", text:"De 500.000 hasta 1.000.000"},
                        {number:1000001, value:"De 1.000.001 hasta 1.500.000", text:"De 1.000.001 hasta 1.500.000"},
                        {number:1500001, value:"De 1.500.001 hasta 2.000.000", text:"De 1.500.001 hasta 2.000.000"},
                        {number:2000001, value:"De 2.000.001 hasta 2.500.000", text:"De 2.000.001 hasta 2.500.000"},
                        {number:2500001, value:"De 2.500.001 hasta 3.000.000", text:"De 2.500.001 hasta 3.000.000"},
                        {number:3000001, value:"De 3.000.001 hasta 3.500.000", text:"De 3.000.001 hasta 3.500.000"},
                        {number:3500001, value:"De 3.500.001 hasta 4.000.000", text:"De 3.500.001 hasta 4.000.000"},
                        {number:4000001, value:"De 4.000.001 hasta 4.500.000", text:"De 4.000.001 hasta 4.500.000"},
                        {number:4500001, value:"De 4.500.001 hasta 5.000.000", text:"De 4.500.001 hasta 5.000.000"},
                        {number:5000001, value:"De 5.000.001 hasta 5.500.000", text:"De 5.000.001 hasta 5.500.000"},
                        {number:5500001, value:"De 5.500.001 hasta 6.000.000", text:"De 5.500.001 hasta 6.000.000"},
                        {number:7000001, value:"De 6.000.001 en adelante", text:"De 6.000.001 en adelante"}
                           ];


    $scope.ingresos_setup = { 
        plugins: ['hidden_textfield'],
        create:true, 
        maxItems:1, 
        valueField: 'value', 
        labelField: 'text', 
        placeholder:'Ingresos totales mensuales',
        onItemAdd : function(value, $item){
            $rootScope.user.data.ingresos_obj = $scope.ingresos_records.filter(function(obj){
                return obj.value == value;
            })[0];
        } 
    };

    $scope.egresos_setup = { 
            plugins: ['hidden_textfield'],
            create:true, maxItems:1, 
            valueField: 'value', 
            labelField: 'text', 
            placeholder:'Egresos totales mensuales',
            onItemAdd : function(value, $item){
                $rootScope.user.data.egresos_obj = $scope.egresos_records.filter(function(obj){
                    return obj.value == value;
                })[0];
            } 
    };

$scope.ocupacion_records = [
    {value:"Administrador (a)"},
    {value:"Administrador en finanzas"},
    {value:"Albañil"},
    {value:"Auditor (a)"},
    {value:"Arquitecto (a) "},
    {value:"Auxiliar de enfermería"},
    {value:"Comunicador social"},
    {value:"Camarero (a)"},
    {value:"Chef"},
    {value:"Contador (a)"},
    {value:"Contralor (a)"},
    {value:"Comerciante"},
    {value:"Deportista profesional"},
    {value:"Diseñador (a) grafico"},
    {value:"Docente"},
    {value:"Economista"},
    {value:"Enfermero (a)"},
    {value:"Estilista"},
    {value:"Estudiante"},
    {value:"Farmacólogo (a)"},
    {value:"Fisioterapeuta"},
    {value:"Fonoaudiólogo (a)"},
    {value:"Gerente (cargos corporativos)"},
    {value:"Ingeniero (a)"},
    {value:"Medico (a)"},
    {value:"Militar (soldado, teniente, etc.)"},
    {value:"Odontólogo"},
    {value:"Policía"},
    {value:"Psicólogo (a)"},
    {value:"Publicista"},
    {value:"Recepcionista"},
    {value:"Secretario (a)"},
    {value:"Servicio al cliente"},
    {value:"Trabajador (a) social"},
    {value:"Técnico (eléctrico, salud ocupacional, sistemas, etc.)"},
    {value:"veterinario"},
    {value:"Vigilante"}
]

    $scope.ocupacion_setup = { 
        create:true, 
        maxItems:1, 
        valueField: 'value', 
        labelField: 'value', 
        searchField : 'value',
        placeholder:'Escribe tu ocupación actual'
    }; 

    $scope.parseCC = function(){
        if($rootScope.user.cc){
             $rootScope.user.cc  = parseInt($rootScope.user.cc);
        }
    }

    $scope.go_to_location = function(){
        if($rootScope.user.data._provider == 'FACEBOOK'){
            $scope.document_exist(function(response){
                if(response.exists > 0){
                      var confirmPopup = $ionicPopup.confirm({
                         title: 'Formulario Incompleto.',
                         template: 'Este número de cedula de ciudadanía ya esta registrado.',
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

                     $scope.cc_exist = true;
                }else{
                    if($rootScope.user.email != $scope.old_email){
                        api.user().add("exists/" + $rootScope.user.email).get().success(function(res){
                            if(res.exists > 0){
                                var error_msg = $ionicPopup.confirm({
                                     title: 'Formulario Incompleto.',
                                     template: 'Esta dirección de correo ya esta registrada.',
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

                                $scope.email_exist = true;
                            }
                        });                        
                    }else{
                         $state.go("location");
                    }
                }

                if(!$scope.email_exist && !$scope.cc_exist){
                    $state.go("location");
                }
            });
        }else{
            $state.go("location");
        }
    }


    $scope.load = function(){
        $scope.form = {};
        $scope.form.data = $rootScope.user;

        if($stateParams.credit){
            $scope.credit = $stateParams.credit;
        }

        $scope.old_email = angular.copy($rootScope.user.email);
    }

    $scope.counter = 5;
    
    $scope.onTimeout = function(){
    
    if($scope.counter == 0){
        $scope.stop()

        var data = {};
        data._user = $rootScope.user._id;
        data._credit = $rootScope.current_credit._id;

        api.contracts().post(data).success(function(res){
            if(res){
                $state.go('dashboard.new', { with_offer : true});
            }
        });

        return;
    }
        $scope.counter--;
        $scope.mytimeout = $timeout($scope.onTimeout, 1000);
    }

    $scope.viewContract = function(){
          Handlebars.registerHelper('formatCurrency', function(value) {
              return $filter('currency')(value);
          });

          $http.get('views/prints/contract.html').success(function(res){
                var _template = Handlebars.compile(res);

                var w = window.open("", "_blank", "scrollbars=yes,resizable=no,top=200,left=200,width=350");
                
                w.document.write(_template({}));
                w.print();
                w.close();
          });
    }

    $scope.document_exist = function(callback){
        if($scope.old_cc != $rootScope.user.cc){
            api.user().add("documento/" + $rootScope.user.cc).get().success(callback);
        }
    }

    $scope.logout = function(){
      window.localStorage.clear();
      
      delete $rootScope.isLogged;
      delete $rootScope.user;

      $state.go('home');
    }

    $scope.go_to = function(state){
        $state.go(state);
    }
        
    $scope.stop = function(){
        $timeout.cancel($scope.mytimeout);
    }

    $scope.go_back = function(){
        window.history.back();
    }

    $scope.update = function(){
        var error_stack = [];

        if(!$rootScope.user.data.ingresos_totales){
            error_stack.push("Ingresos"); 
        }

        if(!$rootScope.user.name){
            error_stack.push("Nombres");
        } 

        if(!$rootScope.user.last_name){
            error_stack.push("Apellidos");
        } 

        if(!$rootScope.user.data.egresos_totales){
            error_stack.push("Egresos");
        }

        if(!$rootScope.user.cc){
            error_stack.push("Cedula de ciudadania");
        }

        if(!$rootScope.user.data.phone){
            error_stack.push("Telefono Celular");
        }

        if(!$rootScope.user.data.sexo){
            error_stack.push("Sexo");
        }

        if(!$rootScope.user.email){
            error_stack.push("Email");
        }

        if(!$rootScope.user.data.ciudad){
            error_stack.push("Ciudad");
        }

        if(!$rootScope.user.data.departamento){
            error_stack.push("Departamento");
        }

        if(!$rootScope.user.data.fecha_nacimiento || !$rootScope.user.data.fecha_nacimiento.day || !$rootScope.user.data.fecha_nacimiento.month || !$rootScope.user.data.fecha_nacimiento.year ){
            error_stack.push("Fecha de nacimiento");
        }

        if(!$rootScope.user.data.fecha_expedicion || !$rootScope.user.data.fecha_expedicion.day || !$rootScope.user.data.fecha_expedicion.month || !$rootScope.user.data.fecha_expedicion.year){
            error_stack.push("Fecha de expedición");
        }

        if(!$rootScope.user.data.numero_cuenta){
            error_stack.push("Numero de cuenta");
        }

        if(!$rootScope.user.data.numero_cuentas_bancaria){
            error_stack.push("Numero de cuentas bancarias");
        }

        if(!$rootScope.user.data.perfil_actual){
            error_stack.push("Perfil actual");
        }

        if(!$rootScope.user.data.tarjeta_credito){
            error_stack.push("Tarjeta de credito");
        }

        if(!$rootScope.user.data.tipo_cuenta){
            error_stack.push("Tipo de cuenta");
        }

        if(!$rootScope.user.data.tipo_vivienda){
            error_stack.push("tipo de vivienda");
        }

        if(!$rootScope.user.data.nivel_estudio){
            error_stack.push("Nivel de estudio");
        }

        if(!$rootScope.user.data.banco_desembolso){
            error_stack.push("Banco Donde recibiras el dinero");
        }

        if(error_stack.length > 0){

          var confirmPopup = $ionicPopup.confirm({
             title: 'Formulario Incompleto.',
             template: 'Estos campos son obligatorios: ' + error_stack.join(", "),
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

           error_stack.length = 0;
           return;
        }

        if($rootScope.user.data.updated){
            delete $rootScope.user.data.ingresos_obj.$order;
            delete $rootScope.user.data.egresos_obj.$order;
            api.user($rootScope.user._id).put($rootScope.user).success(function(res){
                if(res){
                    $state.go("dashboard.home");
                     window.localStorage.user = JSON.stringify($rootScope.user);
                }
            });

            return;  
        }


        $rootScope.updating = true;

        if($rootScope.user.data.ingresos_obj && $rootScope.user.data.egresos_obj){
            var _result = ($rootScope.user.data.ingresos_obj.number - $rootScope.user.data.egresos_obj.number);
            var _cupon = 0; 
            if(_result <= 0){
                _cupon = 150000;
            }else if(_result >= 499999 &&  _result < 1000000){
                _cupon = 200000;
            }else if( _result >= 999999){
                _cupon = 250000;
            }  

            $rootScope.user.data.cupon = _cupon;                      
        }

        $rootScope.user.data.updated = true;

        if(!$rootScope.user.credit){
              delete $rootScope.user.data.ingresos_obj.$order;
              delete $rootScope.user.data.egresos_obj.$order;

              api.user($rootScope.user._id).put($rootScope.user).success(function(res){
                    $state.go('dashboard.new', { with_offer : true }, { reload : true });
                    return;
              });
            
        }else{
            if($rootScope.user.credit.data.amount[0] > _cupon){
                $rootScope.user.credit.data.with_offer = true;

                api.credits().add("current").get().success(function(res){
                    if(res){
                        $rootScope.current_credit = res;
                        $scope.updateOfferCredit = res;
                        $scope.updateOfferCredit.data.with_offer = true;

                        api.credits($scope.updateOfferCredit._id).put($scope.updateOfferCredit).success(function(res){

                        });
                    }
                })
            }
          
          delete $rootScope.user.data.ingresos_obj.$order;
          delete $rootScope.user.data.egresos_obj.$order;

            api.user($rootScope.user._id).put($rootScope.user).success(function(res){
                if(res){
                    $rootScope.user.updated = true;
                    localStorage.user = JSON.stringify($rootScope.user);
                    $scope.updated = true;

                    if($rootScope.user.credit.data.amount[0] <= _cupon){
                            api.credits().add("current").get().success(function(res){
                                if(res){
                                          var confirmPopup = $ionicPopup.confirm({
                                             title: 'Resumen enviado.',
                                             template:"Hemos enviado un resumen de crédito a su correo, por favor léalo cuidadosamente antes de realizar la firma electrónica, el correo puede llegar en su bandeja de entrada o correo no deseado.",
                                              scope: $scope,
                                              buttons: [
                                                {
                                                  text: '<b>Ok</b>',
                                                  type: 'button-custom',
                                                  onTap: function(e) {
                                                    $rootScope.updating = false;

                                                    api.credits().add("email_request/" + res._id).get().success(function(res){
                                                      if(res){
                                                            $state.go('dashboard.home', { without_offer : true }, { reload : true });
                                                      }
                                                    }); 
                                                    
                                                    return true;
                                                  }
                                                }
                                              ]
                                           });
                                }
                            })
                    }else{
                        $state.go('dashboard.new', { with_offer : true} , { reload : true });
                        $rootScope.updating = false;
                    }
                }
            });  
        }
    }
  });