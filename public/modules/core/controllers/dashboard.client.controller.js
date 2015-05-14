'use strict';


angular.module('core').controller('DashboardController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notices', 'Pagination',
	function($scope, $stateParams, $location, Authentication, Notices, Pagination) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		// Pagination stuff - defaults to 5 items per page
		$scope.pagination = Pagination.getNew();


		$scope.notices = Notices.query();

		// calculate the number of pages to display based on the total amount of data from the db for notices
		$scope.pagination.numPages = Math.ceil($scope.notices.length/$scope.pagination.perPage);
		// $scope.pagination.numPages = 3;


				// Find a list of Notices
		$scope.find = function() {
			$scope.notices = Notices.query();

		};


	}
]);