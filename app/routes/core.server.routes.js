'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);

	// get server environment variables, etc.
	app.route('/server/environment')
		.get(core.getEnv);
};