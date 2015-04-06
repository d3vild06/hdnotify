'use strict';

//Templates service used to communicate Templates REST endpoints
angular.module('templates').factory('Templates', ['$resource',
	function($resource) {
		return $resource('templates/:templateId', { templateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);