'use strict';
angular.module('starter.services')
  .service('shoppingCart', function ($rootScope) {
    return {
      totalize : function(products){
        var _total = [];

        for (var i = 0; i < products.length; i++) {
            _total.push(products[i].precio_VentaFacturado || products[i].precio_venta);
        };

        return _total;
      },

      totalizeIva : function(products){
        var _total = [];

        for (var i = 0; i < products.length; i++) {
            _total.push(products[i].ivaFacturado || products[i].valor_iva);
        };

        return _total;
      },

      totalizeBases : function(products){
        var _total = [];

        for (var i = 0; i < products.length; i++) {
          _total.push(products[i].precio_baseFacturado || products[i].precio_venta)
        };

        return _total;
      },

      totalizeDiscount : function(products){
        var _total = [];

        for (var i = 0; i < products.length; i++) {
          _total.push(parseInt(products[i].descuento))
        };

        return _total;
      }
    };
  });
