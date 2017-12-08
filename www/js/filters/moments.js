angular.module('starter').filter('now', function() {
  
  return function(input) {

    var output;

    output = window.moment(input).fromNow();

    return output;

  }

});

angular.module('starter').filter('moment', function (){
  return function (input, momentFn) {
    var args = Array.prototype.slice.call(arguments, 2),
        momentObj = moment(input);
    return momentObj[momentFn].apply(momentObj, args);
  };
});