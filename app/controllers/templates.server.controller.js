'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Template = mongoose.model('Template'),
	_ = require('lodash');

/**
 * Create a Template
 */
exports.create = function(req, res) {
	var template = new Template(req.body);
	template.user = req.user;

	template.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(template);
		}
	});
};

/**
 * Show the current Template
 */
exports.read = function(req, res) {
	res.jsonp(req.template);
};

/**
 * Update a Template
 */
exports.update = function(req, res) {
	var template = req.template ;

	template = _.extend(template , req.body);

	template.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(template);
		}
	});
};

/**
 * Delete an Template
 */
exports.delete = function(req, res) {
	var template = req.template ;

	template.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(template);
		}
	});
};

/**
 * List of Templates
 */
exports.list = function(req, res) { 
	Template.find().sort('-created').populate('user', 'displayName').exec(function(err, templates) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(templates);
		}
	});
};

/**
 * Template middleware
 */
exports.templateByID = function(req, res, next, id) { 
	Template.findById(id).populate('user', 'displayName').exec(function(err, template) {
		if (err) return next(err);
		if (! template) return next(new Error('Failed to load Template ' + id));
		req.template = template ;
		next();
	});
};

/**
 * Template authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.template.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
