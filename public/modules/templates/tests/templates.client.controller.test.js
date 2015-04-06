'use strict';

(function() {
	// Templates Controller Spec
	describe('Templates Controller Tests', function() {
		// Initialize global variables
		var TemplatesController,
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

			// Initialize the Templates controller.
			TemplatesController = $controller('TemplatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Template object fetched from XHR', inject(function(Templates) {
			// Create sample Template using the Templates service
			var sampleTemplate = new Templates({
				name: 'New Template'
			});

			// Create a sample Templates array that includes the new Template
			var sampleTemplates = [sampleTemplate];

			// Set GET response
			$httpBackend.expectGET('templates').respond(sampleTemplates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.templates).toEqualData(sampleTemplates);
		}));

		it('$scope.findOne() should create an array with one Template object fetched from XHR using a templateId URL parameter', inject(function(Templates) {
			// Define a sample Template object
			var sampleTemplate = new Templates({
				name: 'New Template'
			});

			// Set the URL parameter
			$stateParams.templateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/templates\/([0-9a-fA-F]{24})$/).respond(sampleTemplate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.template).toEqualData(sampleTemplate);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Templates) {
			// Create a sample Template object
			var sampleTemplatePostData = new Templates({
				name: 'New Template'
			});

			// Create a sample Template response
			var sampleTemplateResponse = new Templates({
				_id: '525cf20451979dea2c000001',
				name: 'New Template'
			});

			// Fixture mock form input values
			scope.name = 'New Template';

			// Set POST response
			$httpBackend.expectPOST('templates', sampleTemplatePostData).respond(sampleTemplateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Template was created
			expect($location.path()).toBe('/templates/' + sampleTemplateResponse._id);
		}));

		it('$scope.update() should update a valid Template', inject(function(Templates) {
			// Define a sample Template put data
			var sampleTemplatePutData = new Templates({
				_id: '525cf20451979dea2c000001',
				name: 'New Template'
			});

			// Mock Template in scope
			scope.template = sampleTemplatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/templates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/templates/' + sampleTemplatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid templateId and remove the Template from the scope', inject(function(Templates) {
			// Create new Template object
			var sampleTemplate = new Templates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Templates array and include the Template
			scope.templates = [sampleTemplate];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/templates\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTemplate);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.templates.length).toBe(0);
		}));
	});
}());