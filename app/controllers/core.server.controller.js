'use strict';

/**
 * Module dependencies.
 */

var config = require('../../config/config');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.getEnv = function(req, res) {
	var enviroment = process.env.NODE_ENV;
	var version = config.version;
	res.jsonp({env: enviroment, app_ver: version});
};