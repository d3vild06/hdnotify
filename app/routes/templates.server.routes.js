'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var templates = require('../../app/controllers/templates.server.controller');

	// Templates Routes
	app.route('/templates')
		.get(templates.list)
		.post(users.requiresLogin, templates.create);

	app.route('/templates/:templateId')
		.get(templates.read)
		.put(users.requiresLogin, templates.hasAuthorization, templates.update)
		.delete(users.requiresLogin, templates.hasAuthorization, templates.delete);

	// Finish by binding the Template middleware
	app.param('templateId', templates.templateByID);
};
