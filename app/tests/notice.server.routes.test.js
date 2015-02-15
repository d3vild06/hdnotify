'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Notice = mongoose.model('Notice'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, notice;

/**
 * Notice routes tests
 */
describe('Notice CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Notice
		user.save(function() {
			notice = {
				name: 'Notice Name'
			};

			done();
		});
	});

	it('should be able to save Notice instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Notice
				agent.post('/notices')
					.send(notice)
					.expect(200)
					.end(function(noticeSaveErr, noticeSaveRes) {
						// Handle Notice save error
						if (noticeSaveErr) done(noticeSaveErr);

						// Get a list of Notices
						agent.get('/notices')
							.end(function(noticesGetErr, noticesGetRes) {
								// Handle Notice save error
								if (noticesGetErr) done(noticesGetErr);

								// Get Notices list
								var notices = noticesGetRes.body;

								// Set assertions
								(notices[0].user._id).should.equal(userId);
								(notices[0].name).should.match('Notice Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Notice instance if not logged in', function(done) {
		agent.post('/notices')
			.send(notice)
			.expect(401)
			.end(function(noticeSaveErr, noticeSaveRes) {
				// Call the assertion callback
				done(noticeSaveErr);
			});
	});

	it('should not be able to save Notice instance if no name is provided', function(done) {
		// Invalidate name field
		notice.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Notice
				agent.post('/notices')
					.send(notice)
					.expect(400)
					.end(function(noticeSaveErr, noticeSaveRes) {
						// Set message assertion
						(noticeSaveRes.body.message).should.match('Please fill Notice name');
						
						// Handle Notice save error
						done(noticeSaveErr);
					});
			});
	});

	it('should be able to update Notice instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Notice
				agent.post('/notices')
					.send(notice)
					.expect(200)
					.end(function(noticeSaveErr, noticeSaveRes) {
						// Handle Notice save error
						if (noticeSaveErr) done(noticeSaveErr);

						// Update Notice name
						notice.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Notice
						agent.put('/notices/' + noticeSaveRes.body._id)
							.send(notice)
							.expect(200)
							.end(function(noticeUpdateErr, noticeUpdateRes) {
								// Handle Notice update error
								if (noticeUpdateErr) done(noticeUpdateErr);

								// Set assertions
								(noticeUpdateRes.body._id).should.equal(noticeSaveRes.body._id);
								(noticeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Notices if not signed in', function(done) {
		// Create new Notice model instance
		var noticeObj = new Notice(notice);

		// Save the Notice
		noticeObj.save(function() {
			// Request Notices
			request(app).get('/notices')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Notice if not signed in', function(done) {
		// Create new Notice model instance
		var noticeObj = new Notice(notice);

		// Save the Notice
		noticeObj.save(function() {
			request(app).get('/notices/' + noticeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', notice.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Notice instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Notice
				agent.post('/notices')
					.send(notice)
					.expect(200)
					.end(function(noticeSaveErr, noticeSaveRes) {
						// Handle Notice save error
						if (noticeSaveErr) done(noticeSaveErr);

						// Delete existing Notice
						agent.delete('/notices/' + noticeSaveRes.body._id)
							.send(notice)
							.expect(200)
							.end(function(noticeDeleteErr, noticeDeleteRes) {
								// Handle Notice error error
								if (noticeDeleteErr) done(noticeDeleteErr);

								// Set assertions
								(noticeDeleteRes.body._id).should.equal(noticeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Notice instance if not signed in', function(done) {
		// Set Notice user 
		notice.user = user;

		// Create new Notice model instance
		var noticeObj = new Notice(notice);

		// Save the Notice
		noticeObj.save(function() {
			// Try deleting Notice
			request(app).delete('/notices/' + noticeObj._id)
			.expect(401)
			.end(function(noticeDeleteErr, noticeDeleteRes) {
				// Set message assertion
				(noticeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Notice error error
				done(noticeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Notice.remove().exec();
		done();
	});
});