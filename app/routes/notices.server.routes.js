'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var notices = require('../../app/controllers/notices.server.controller');

	// Notices Routes
	app.route('/notices')
		.get(notices.list)
		.post(users.requiresLogin, notices.create);

	// get latest notice
	app.route('/notices/status/latest')
		.get(notices.getLatestNotice);

	// get list of notice templates
	app.route('/notices/templates')
		.get(notices.listTemplates);
	// 	.post(notices.createTemplate);

	// app.route('notices/templates/:templateId')
	// 	.get(notices.readTemplate)
	// 	.put(notices.updateTemplate);


	app.route('/notices/:noticeId')
		.get(notices.read)
		.put(users.requiresLogin, notices.update)
		.delete(notices.delete); // users.requiresLogin, notices.hasAuthorization, 

	// Finish by binding the Notice middleware
	app.param('noticeId', notices.noticeByID);
};
