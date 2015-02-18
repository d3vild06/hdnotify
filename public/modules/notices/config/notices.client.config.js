'use strict';

// Configuring the notices module
angular.module('notices').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// order of parameters
		// menuId, menuItemTitle, menuItemURL, iconClass, menuItemType, menuItemUIRoute, isPublic, roles, position
		Menus.addMenuItem('topbar', 'New Notice', 'notices/create', 'fa-pencil');
	}
]);