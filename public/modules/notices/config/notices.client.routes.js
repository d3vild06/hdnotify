'use strict';

//Setting up route
angular.module('notices').config(['$stateProvider',
	function($stateProvider) {
		// Notices state routing
		$stateProvider.
		state('listNotices', {
			url: '/notices',
			templateUrl: 'modules/notices/views/list-notices.client.view.html'
		}).
		state('createNotice', {
			url: '/notices/create',
			templateUrl: 'modules/notices/views/create-notice.client.view.html'
		}).
		state('viewNotice', {
			url: '/notices/:noticeId',
			templateUrl: 'modules/notices/views/view-notice.client.view.html'
		}).
		state('updateNotice', {
			url: '/notices/:noticeId/update',
			templateUrl: 'modules/notices/views/update-notice.client.view.html'
		});
	}
]);