'use strict';

//Metrics service used to communicate Metrics REST endpoints
angular.module('metrics').factory('Metrics', ['$resource',
	function($resource) {
		return $resource('metrics/:metricId', { metricId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);