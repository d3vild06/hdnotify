'use strict';

//Setting up route
angular.module('metrics').config(['$stateProvider',
	function($stateProvider) {
		// Metrics state routing
		$stateProvider.
		state('listMetrics', {
			url: '/metrics',
			templateUrl: 'modules/metrics/views/list-metrics.client.view.html'
		}).
		state('createMetric', {
			url: '/metrics/create',
			templateUrl: 'modules/metrics/views/create-metric.client.view.html'
		}).
		state('viewMetric', {
			url: '/metrics/:metricId',
			templateUrl: 'modules/metrics/views/view-metric.client.view.html'
		}).
		state('editMetric', {
			url: '/metrics/:metricId/edit',
			templateUrl: 'modules/metrics/views/edit-metric.client.view.html'
		});
	}
]);