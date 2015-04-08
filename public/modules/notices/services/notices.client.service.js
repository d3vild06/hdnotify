'use strict';

//Notices service used to communicate Notices REST endpoints
angular.module('notices').factory('Notices', ['$resource',
	function($resource) {
		return $resource('notices/:noticeId', { noticeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			getLatest: {
				method: 'GET',
				url: 'notices/status/latest',
				isArray: false
			},
			getTemplates: {
				method: 'GET',
				url: 'notices/templates/:templateId',
				isArray: true
			},
			getEnv: {
				method: 'GET',
				url: 'server/environment',
				isArray: false
			}
		});
	}
]);