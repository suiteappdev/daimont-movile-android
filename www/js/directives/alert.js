angular.module("starter").controller('IonicAlertController', ['$scope', '$attrs', function ($scope, $attrs) {
	$scope.closeable = 'close' in $attrs;
	this.close = $scope.close;
}]);

angular.module("starter").directive('alert', function () {
	return {
		restrict: 'EA',
		controller: 'IonicAlertController',
		template: '<div class=\"card\" role=\"alert\"><a class=\"ionic-item item-text-wrap item-icon-right\" ng-class=\"\'alert-\' + type\" href=\"#\"><div ng-transclude></div></a></div>',
    // template: 'templates/alert.html',
		transclude: true,
		replace: true,
		scope: {
			type: '@',
			close: '&'
		}
	};
});