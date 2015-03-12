'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var notices = require('../../app/controllers/notices.server.controller');

	// Notices Routes
	app.route('/notices')
		.get(notices.list)
		.post(users.requiresLogin, notices.create);

	// get list of notice based on status
	app.route('/notices/status/:state')
		.get(notices.noticeByStatus);


	app.route('/notices/:noticeId')
		.get(notices.read)
		.put(users.requiresLogin, notices.hasAuthorization, notices.update)
		.delete(notices.delete); // users.requiresLogin, notices.hasAuthorization, 

	// Finish by binding the Notice middleware
	app.param('noticeId', notices.noticeByID);
};
