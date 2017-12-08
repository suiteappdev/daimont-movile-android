 angular.module('starter').directive('banksField', function () {
  	function ctrl($scope, api, $rootScope){

        if($scope.showAll){
            $scope.records = [
              {name : 'Bancolombia', img : 'img/bancolombia.png', account:'08280125459', nit:'901091741', owner:'DAIMONT S.A.S.', type:'Ahorros' },
              {name : 'Davivienda', img : 'img/davivienda.png', account:'047000058975', owner:'LUIS FERNANDO ALVAREZ FLOREZ', cc:'1098735034', type:'Ahorros'},
              {name : 'Banco BBVA', img : 'img/bbva.png', account:'488011560', nit:'901091741', owner:'DAIMONT SAS', type:'Corriente' },
              {name : 'Banco de Bogotá', img : 'img/bogota.png', account:'592622575', owner:'LUIS FERNANDO ALVAREZ FLOREZ', cc:'1098735034', type:'Ahorros' },
              {name : 'Banco de Occidente', img : 'img/occidente.png' },
              {name : 'Banco AV Villas', img : 'img/avvillas.png'},
              {name : 'Banco Popular', img : 'img/popular.png'}
            ]          
          }else{
            $scope.records = [
              {name : 'Bancolombia', img : 'img/bancolombia.png', account:'08280125459', nit:'901091741', owner:'DAIMONT S.A.S.', type:'Ahorros' },
              {name : 'Davivienda', img : 'img/davivienda.png', account:'047000058975', owner:'LUIS FERNANDO ALVAREZ FLOREZ', cc:'1098735034', type:'Ahorros'},
              {name : 'Banco BBVA', img : 'img/bbva.png', account:'488011560', nit:'901091741', owner:'DAIMONT SAS', type:'Corriente' },
              {name : 'Banco de Bogotá', img : 'img/bogota.png', account:'592622575', owner:'LUIS FERNANDO ALVAREZ FLOREZ', cc:'1098735034', type:'Ahorros' },
            ]        
          } 
               
        $scope.myConfig = {
          plugins: ['hidden_textfield'],
          noResultText :'aun no tenemos registrado este banco.',
          create:false,
          valueField: $scope.key,
          labelField: $scope.label,
          placeholder: $scope.placeholder || 'Bancos',
          maxItems: 1,
          searchField : $scope.searchby || 'name',
          maxOptions : 8,
          openOnFocus : true,
          selectOnTab : true,
          setFocus : $scope.setFocus || false,
          render: {
                option: function(item, escape) {
                    if(item.img){
                      return '<div><img class="bank-dropdown-items" src="'+item.img+'" />' +
                           '<span class="bank-dropdown-value">'+escape(item.name)+'</span></div>'
                    }
              }
          },

          onItemAdd : function(value, $item){
            $scope.records.forEach(function(v, k){
              if(v[$scope.key] == value){
                    var _bank = angular.copy(v);
                    delete  _bank.$order;

                    $scope.setObject = _bank;
                    return;
              }
            });
          }
        };

  	 };
      
    return {
      template: '<selectize config="myConfig" options="records" ng-model="ngModel"></selectize>',
      restrict: 'EA',
      scope : {
      	ngModel : "=",
        setObject:"=",
        setFocus : "=",
        showAll : "@",
        key : "@",
        label : "@",
        searchby:"=",
        placeholder:"@"
      },
      controller :ctrl,
      link: function postLink(scope, element, attrs) {
      
      }
    };
  });