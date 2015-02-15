'use strict';

(function() {
	// Notices Controller Spec
	describe('Notices Controller Tests', function() {
		// Initialize global variables
		var NoticesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Notices controller.
			NoticesController = $controller('NoticesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Notice object fetched from XHR', inject(function(Notices) {
			// Create sample Notice using the Notices service
			var sampleNotice = new Notices({
				name: 'New Notice'
			});

			// Create a sample Notices array that includes the new Notice
			var sampleNotices = [sampleNotice];

			// Set GET response
			$httpBackend.expectGET('notices').respond(sampleNotices);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.notices).toEqualData(sampleNotices);
		}));

		it('$scope.findOne() should create an array with one Notice object fetched from XHR using a noticeId URL parameter', inject(function(Notices) {
			// Define a sample Notice object
			var sampleNotice = new Notices({
				name: 'New Notice'
			});

			// Set the URL parameter
			$stateParams.noticeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/notices\/([0-9a-fA-F]{24})$/).respond(sampleNotice);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.notice).toEqualData(sampleNotice);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Notices) {
			// Create a sample Notice object
			var sampleNoticePostData = new Notices({
				name: 'New Notice'
			});

			// Create a sample Notice response
			var sampleNoticeResponse = new Notices({
				_id: '525cf20451979dea2c000001',
				name: 'New Notice'
			});

			// Fixture mock form input values
			scope.name = 'New Notice';

			// Set POST response
			$httpBackend.expectPOST('notices', sampleNoticePostData).respond(sampleNoticeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Notice was created
			expect($location.path()).toBe('/notices/' + sampleNoticeResponse._id);
		}));

		it('$scope.update() should update a valid Notice', inject(function(Notices) {
			// Define a sample Notice put data
			var sampleNoticePutData = new Notices({
				_id: '525cf20451979dea2c000001',
				name: 'New Notice'
			});

			// Mock Notice in scope
			scope.notice = sampleNoticePutData;

			// Set PUT response
			$httpBackend.expectPUT(/notices\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/notices/' + sampleNoticePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid noticeId and remove the Notice from the scope', inject(function(Notices) {
			// Create new Notice object
			var sampleNotice = new Notices({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Notices array and include the Notice
			scope.notices = [sampleNotice];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/notices\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleNotice);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.notices.length).toBe(0);
		}));
	});
}());