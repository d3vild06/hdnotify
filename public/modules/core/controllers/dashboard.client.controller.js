'use strict';


angular.module('core').controller('DashboardController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notices',
	function($scope, $stateParams, $location, Authentication, Notices) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

				// Find a list of Notices
		$scope.find = function() {
			$scope.notices = Notices.query();
		};

	}
]);