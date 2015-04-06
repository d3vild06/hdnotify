'use strict';

// Templates controller
angular.module('templates').controller('TemplatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Templates',
	function($scope, $stateParams, $location, Authentication, Templates) {
		$scope.authentication = Authentication;

		// Create new Template
		$scope.create = function() {
			// Create new Template object
			var template = new Templates ({
				name: this.name
			});

			// Redirect after save
			template.$save(function(response) {
				$location.path('templates/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Template
		$scope.remove = function(template) {
			if ( template ) { 
				template.$remove();

				for (var i in $scope.templates) {
					if ($scope.templates [i] === template) {
						$scope.templates.splice(i, 1);
					}
				}
			} else {
				$scope.template.$remove(function() {
					$location.path('templates');
				});
			}
		};

		// Update existing Template
		$scope.update = function() {
			var template = $scope.template;

			template.$update(function() {
				$location.path('templates/' + template._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Templates
		$scope.find = function() {
			$scope.templates = Templates.query();
		};

		// Find existing Template
		$scope.findOne = function() {
			$scope.template = Templates.get({ 
				templateId: $stateParams.templateId
			});
		};
	}
]);