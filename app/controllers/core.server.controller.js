'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.getEnv = function(req, res) {
	var enviroment = process.env.NODE_ENV;
	res.jsonp({env: enviroment});
};