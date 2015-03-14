'use strict';

// Notices controller
angular.module('notices').controller('NoticesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notices',
	function($scope, $stateParams, $location, Authentication, Notices, Templates) {
		$scope.authentication = Authentication;

		// Create new Notice
		$scope.create = function() {
			// Create new Notice object
			var notice = new Notices ({
				notice_type: this.type,
				title: this.noticeForm.title,
				status: 'active',
				auto_update: this.update_time,
				ticket_number: this.ticket,
				priority: this.priority,
				services_affected: this.noticeForm.services_affected,
				biz_impact: this.noticeForm.biz_impact,
				outage_start_time: this.data.date,
				regions_affected: this.noticeForm.regions_affected,
				workaround: this.noticeForm.workaround

			});

			// Redirect after save
			notice.$save(function(response) {
				// $location.path('notices/' + response._id);
				//redirect to dashboard
				$location.path('/');

				// Clear form fields
				$scope.type = '';
				$scope.noticeForm.title = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Notice
		$scope.remove = function(notice) {
			if ( notice ) { 
				notice.$remove();

				for (var i in $scope.notices) {
					if ($scope.notices [i] === notice) {
						$scope.notices.splice(i, 1);
					}
				}
			} else {
				$scope.notice.$remove(function() {
					$location.path('notices');
				});
			}
		};

		// Update existing Notice
		$scope.update = function() {
			var notice = $scope.notice;

			notice.$update(function() {
				$location.path('notices/' + notice._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Notices
		$scope.find = function() {
			$scope.notices = Notices.query();
		};

		// Find existing Notice
		$scope.findOne = function() {
			$scope.notice = Notices.get({ 
				noticeId: $stateParams.noticeId
			});
		};

		// find latest notice based on state (active | closed)
		$scope.findOneActive = function() {
			$scope.notice = Notices.active();
		};

		// get template info
		$scope.templates = Notices.getTemplates();


	}

]);