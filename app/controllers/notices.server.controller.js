'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Notice = mongoose.model('Notice'),
	_ = require('lodash'),
	config = require('../../config/config'),
	nodemailer = require('nodemailer'),
	sendMail = require('nodemailer-sendmail-transport');

/**
 * Create a Notice
 * POST method to /notices
 */
exports.create = function(req, res) {
	var notice = new Notice(req.body);
	//capture the logged in username
	notice.created_by = req.user.username;

	notice.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// if no error saving to DB, send email safely
			var emailHtml = res.render('templates/new-notice', {
				title: req.body.title,
				reason: req.body.notice_type,
				regions: req.body.regions_affected,
				outage_start_time: req.body.outage_start_time,
				services: req.body.services_affected,
				biz_impact: req.body.biz_impact
			});
			var transporter = nodemailer.createTransport(sendMail(config.mailer.options));
			var mailOptions = {
				to: 'roberto.quezada@hds.com',
				from: config.mailer.from,
				subject: req.body.title,
				html: emailHtml
			};
			transporter.sendMail(mailOptions, function(err) {
				if (!err) {
					res.status(200).send({
						message: 'Notice successfully saved and email notification sent out!'
					});
				} else {
					return res.status(500).send({
						message: errorHandler.getErrorMessage(err)
					});
				}

			});

			// res.jsonp(notice);
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
 * return notice based on status
 */
exports.noticeByStatus = function(req, res) {
	var state = req.params.state;
	Notice.findOne({status: state}).sort({created:-1}).exec(function(err, notice) {
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
