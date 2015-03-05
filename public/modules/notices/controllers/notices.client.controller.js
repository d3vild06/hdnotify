'use strict';

// Notices controller
angular.module('notices').controller('NoticesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notices',
	function($scope, $stateParams, $location, Authentication, Notices) {
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
				services_affected: this.noticeForm.services,
				biz_impact: this.noticeForm.biz_impact,
				outage_start_time: this.data.date,
				regions_affected: this.noticeForm.regions,
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

		// find latest notice
		$scope.findLatest = function() {
			$scope.notice = Notices.get({ 
				sort: {created: -1}
			});
		};

		// mockup notice template data
		$scope.templates = [
		{
			id: 1,
			title: 'myHDS.com Unavailable',
			reason: 'Uplanned Outage',
			regions: 'Global',
			services: 'myHDS.hds.com',
			biz_impact: 'SSO to corporate applications via myHDS',
			workaround: 'none'
		},

		{
			id: 2,
			title: 'portal.hds.com Unavailable',
			reason: 'Uplanned Outage',
			regions: 'APAC',
			services: 'Access to portal.hds.com',
			biz_impact: 'Access to various applications for partners and customers such as PQM',
			workaround: 'none'
		},

		{
			id: 3,
			title: 'Identity Access Management',
			reason: 'Uplanned Outage',
			regions: 'Global',
			services: 'Single Sign On (SSO) services',
			biz_impact: 'SSO to corporate applications via myHDS and portal.hds.com',
			workaround: 'none'
		},

		{
			id: 4,
			title: 'mSupportPRO Application Issues',
			reason: 'Uplanned Outage',
			regions: 'Global',
			services: 'Mobility',
			biz_impact: 'Users are unable to access, create or view Service Requests via the mSupportPRO applicaton at this time',
			workaround: 'none'
		},

		{
			id: 5,
			title: 'theLoop Unavailable',
			reason: 'Uplanned Outage',
			regions: 'Global',
			services: 'theLoop (Jive)',
			biz_impact: 'Users are unable to login or create documents at this time',
			workaround: 'none'
		}

		];

	}

]);