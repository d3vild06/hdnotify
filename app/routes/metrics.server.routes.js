'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var metrics = require('../../app/controllers/metrics.server.controller');

	// Metrics Routes
	app.route('/metrics')
		.get(metrics.latestNotice)
		.post(users.requiresLogin, metrics.create);

	app.route('/metrics/:metricId')
		.get(metrics.read)
		.put(users.requiresLogin, metrics.hasAuthorization, metrics.update)
		.delete(users.requiresLogin, metrics.hasAuthorization, metrics.delete);

	// Finish by binding the Metric middleware
	app.param('metricId', metrics.metricByID);
};
