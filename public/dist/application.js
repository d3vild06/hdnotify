'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'hdnotify';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'ui.bootstrap.datetimepicker', 'simplePagination'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('notices');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('templates');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/dashboard.client.view.html'
		});
	}
]);
'use strict';


angular.module('core').controller('DashboardController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notices', 'Pagination',
	function($scope, $stateParams, $location, Authentication, Notices, Pagination) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		// Pagination stuff - defaults to 5 items per page
		$scope.pagination = Pagination.getNew();


		$scope.notices = Notices.query();

		// calculate the number of pages to display based on the total amount of data from the db for notices
		$scope.pagination.numPages = Math.ceil($scope.notices.length/$scope.pagination.perPage);
		// $scope.pagination.numPages = 3;


				// Find a list of Notices
		$scope.find = function() {
			$scope.notices = Notices.query();

		};


	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'Notices',
	function($scope, Authentication, Menus, Notices) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.server = Notices.getEnv();
	}
]);
'use strict';

//Directive used to set metisMenu and minimalize button
angular.module('core')
    .directive('sideNavigation', ["$timeout", function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                // Call metsi to build when user signup
                scope.$watch('authentication.user', function() {
                    $timeout(function() {
                        element.metisMenu();
                    });
                });

            }
        };
    }])
    .directive('minimalizaSidebar', ["$timeout", function ($timeout) {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-danger" href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: ["$scope", "$element", function ($scope, $element) {
                $scope.minimalize = function () {
                    angular.element('body').toggleClass('mini-navbar');
                    if (!angular.element('body').hasClass('mini-navbar') || angular.element('body').hasClass('body-small')) {
                        // Hide menu in order to smoothly turn on when maximize menu
                        angular.element('#side-menu').hide();
                        // For smoothly turn on menu
                        $timeout(function () {
                            angular.element('#side-menu').fadeIn(500);
                        }, 100);
                    } else {
                        // Remove all inline style from jquery fadeIn function to reset menu state
                        angular.element('#side-menu').removeAttr('style');
                    }
                };
            }]
        };
    }]);


'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, iconClass, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				iconClass: iconClass, //|| 'fa-laptop',
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,               
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
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
'use strict';

//Setting up route
angular.module('notices').config(['$stateProvider',
	function($stateProvider) {
		// Notices state routing
		$stateProvider.
		state('listNotices', {
			url: '/notices',
			templateUrl: 'modules/core/views/dashboard.client.view.html'
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
'use strict';

// Notices controller
angular.module('notices').controller('NoticesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Notices',
	function($scope, $stateParams, $location, Authentication, Notices, Templates) {
		$scope.authentication = Authentication;


		// Create new Notice
		$scope.create = function() {
			// Create new Notice object
			var notice = new Notices ({
				notice_type: this.type,
				subject: this.noticeForm.subject,
				status: 'active',
				auto_update: this.update_time,
				ticket_number: this.ticket,
				priority: this.priority,
				impacted_services: this.noticeForm.impacted_services,
				description: this.noticeForm.description,
				status_update: this.noticeForm.status_update,
				outage_start_time: this.outage_start_time,
				affected_regions: this.noticeForm.affected_regions,
				// workaround: this.noticeForm.workaround,
				email_dlist: this.noticeForm.email_dlist

			});

			// Redirect after save
			notice.$save(function(response) {
				// $location.path('notices/' + response._id);
				//redirect to dashboard
				$location.path('/');


			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Notice
		$scope.remove = function(notice) {
			if ( notice ) { 
				notice.$remove();

				for (var i in $scope.notices) {
					if ($scope.notices [i] === notice) {
						$scope.notices.splice(i, 1);
					}
				}
			} else {
				$scope.notice.$remove(function() {
					$location.path('notices');
				});
			}
		};

		// checker function to show additional drop down fields based on update type (update/resolution)
		//default to false
		this.check = false;

		$scope.updateCheck = function() {
			var update_type = this.notice.status;

			if (update_type === 'closed') {
				this.check = true;
			} else {
				this.check = false;
			}
		};
		// Update existing Notice
		$scope.update = function() {
			var notice = $scope.notice;

			notice.$update(function() {
				$location.path('/');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Notices
		$scope.find = function() {
			$scope.notices = Notices.query();
		};

		// Find existing Notice
		$scope.findOne = function() {
			$scope.notice = Notices.get({ 
				noticeId: $stateParams.noticeId
			});		
		};

		// find latest notice based on state (active | closed)
		$scope.findLatest= function() {
			$scope.notice = Notices.getLatest();
		};

		// get template info
		$scope.templates = Notices.getTemplates();

		/**
		* Get node server environment variables
		* this will help set debug options
		*/
		
		// $scope.server = Notices.getEnv();



	}

]);
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
'use strict';

// Configuring the notices module
angular.module('templates').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// order of parameters
		// menuId, menuItemTitle, menuItemURL, iconClass, menuItemType, menuItemUIRoute, isPublic, roles, position
		Menus.addMenuItem('topbar', 'New Template', 'templates/create', 'fa-plus');
		Menus.addMenuItem('topbar', 'Edit Template', 'templates', 'fa-pencil-square-o');
	}
]);
'use strict';

//Setting up route
angular.module('templates').config(['$stateProvider',
	function($stateProvider) {
		// Templates state routing
		$stateProvider.
		state('listTemplates', {
			url: '/templates',
			templateUrl: 'modules/templates/views/list-templates.client.view.html'
		}).
		state('createTemplate', {
			url: '/templates/create',
			templateUrl: 'modules/templates/views/create-template.client.view.html'
		}).
		state('viewTemplate', {
			url: '/templates/:templateId',
			templateUrl: 'modules/templates/views/view-template.client.view.html'
		}).
		state('editTemplate', {
			url: '/templates/:templateId/edit',
			templateUrl: 'modules/templates/views/edit-template.client.view.html'
		});
	}
]);
'use strict';

// Templates controller
angular.module('templates').controller('TemplatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Templates',
	function($scope, $stateParams, $location, Authentication, Templates) {
		$scope.authentication = Authentication;

		// Create new Template
		$scope.create = function() {
			// Create new Template object
			var template = new Templates ({
				subject: this.subject,
				affected_regions: this.affected_regions,
				impacted_services: this.impacted_services,
				description: this.description,
				email_dlist: this.email_dlist

			});

			// Redirect after save
			template.$save(function(response) {
				$location.path('templates/' + response._id);

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Template
		$scope.remove = function(template) {
			if ( template ) { 
				template.$remove();

				for (var i in $scope.templates) {
					if ($scope.templates [i] === template) {
						$scope.templates.splice(i, 1);
					}
				}
			} else {
				$scope.template.$remove(function() {
					$location.path('templates');
				});
			}
		};

		// Update existing Template
		$scope.update = function() {
			var template = $scope.template;

			template.$update(function() {
				$location.path('templates/' + template._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Templates
		$scope.find = function() {
			$scope.templates = Templates.query();
		};

		// Find existing Template
		$scope.findOne = function() {
			$scope.template = Templates.get({ 
				templateId: $stateParams.templateId
			});
		};
	}
]);
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
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;


				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				var errorMessage;
				if (response.name === 'InvalidCredentialsError') {
					$scope.error = 'Invalid Username or Password';
				}
				else {
				$scope.error = response.message;
				}
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);