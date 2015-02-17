'use strict';

// Configuring the notices module
angular.module('notices').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'New Notice', 'notices/create', 'fa-paper-plane-o');
	}
]);