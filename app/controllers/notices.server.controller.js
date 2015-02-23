'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Notice = mongoose.model('Notice'),
	_ = require('lodash');

/**
 * Create a Notice
 * POST method to /notices
 */
exports.create = function(req, res) {
	var notice = new Notice(req.body);
	notice.user = req.user;

	notice.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(notice);
		}
	});
};

/**
 * Show the current Notice
 */
exports.read = function(req, res) {
	res.jsonp(req.notice);
};

/**
 * Update a Notice
 */
exports.update = function(req, res) {
	var notice = req.notice ;

	notice = _.extend(notice , req.body);

	notice.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(notice);
		}
	});
};

/**
 * Delete an Notice
 */
exports.delete = function(req, res) {
	var notice = req.notice ;

	notice.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(notice);
		}
	});
};

/**
 * List of Notices
 */
exports.list = function(req, res) {
	Notice.find(function(err, notices) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(notices);
		}
	});
};

/**
 * Get count of notices (active or closed or total)
 */
exports.getCount = function(req, res) {
    var type = req.params.type;
    Notice.count({status: type}, function(err, count) {
        res.jsonp(count);
    });
};

/**
 * Notice middleware
 */
exports.noticeByID = function(req, res, next, id) {
	Notice.findById(id).populate('user', 'displayName').exec(function(err, notice) {
		if (err) return next(err);
		if (! notice) return next(new Error('Failed to load Notice ' + id));
		req.notice = notice ;
		next();
	});
};

/**
 * Notice authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.notice.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
