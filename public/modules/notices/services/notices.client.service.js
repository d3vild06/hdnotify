'use strict';

//Notices service used to communicate Notices REST endpoints
angular.module('notices').factory('Notices', ['$resource',
	function($resource) {
		return $resource('notices/:noticeId', { noticeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			active: {
				method: 'GET',
				params: {state: 'active'},
				url: 'notices/status/:state'
			},
			getTemplates: {
				method: 'GET',
				url: 'notices/templates/:templateId',
				isArray: true
			}
		});
	}
]);