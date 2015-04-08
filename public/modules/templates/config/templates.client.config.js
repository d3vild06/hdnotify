'use strict';

// Configuring the notices module
angular.module('templates').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// order of parameters
		// menuId, menuItemTitle, menuItemURL, iconClass, menuItemType, menuItemUIRoute, isPublic, roles, position
		Menus.addMenuItem('topbar', 'New Template', 'templates/create', 'fa-plus');
	}
]);