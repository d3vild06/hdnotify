'use strict';

//Notices service used to communicate Notices REST endpoints
angular.module('notices').factory('Notices', ['$resource',
	function($resource) {
		return $resource('notices/:noticeId', { noticeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);