'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Notice = mongoose.model('Notice'),
	Template = mongoose.model('Template'),
	_ = require('lodash'),
	config = require('../../config/config'),
	path = require('path'),
	templatesDir = path.resolve(__dirname, '../views', 'templates'),
	emailTemplates = require('email-templates'),
	nodemailer = require('nodemailer'),
	sendMail = require('nodemailer-sendmail-transport');

/**
 * Create a Notice
 * POST method to /notices
 */
exports.create = function(req, res) {
	var notice = new Notice(req.body);
	//capture the logged in username
	//notice.created_by = req.user.username;
	notice.created_by = req.user._id;


	notice.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// if no error saving to DB, send email safely
			// we're using email-template here so gotta construct object
			emailTemplates(templatesDir, function(err, template) {

				  if (err) {
				    return res.status(500).send({
			        	message: errorHandler.getErrorMessage(err)
			        });
				  } else {


			var emailHtmlnew = {
				title: req.body.title,
				reason: req.body.notice_type,
				regions: req.body.regions_affected,
				outage_start_time: req.body.outage_start_time,
				services: req.body.services_affected,
				biz_impact: req.body.biz_impact,
				ticket_number: req.body.ticket_number,
				workaround: req.body.workaround
			};
			template('new-notice', emailHtmlnew, function(err, html, text) {
			      if (err) {
			        return res.status(500).send({
			        	message: errorHandler.getErrorMessage(err)
			        });
			      } else {

			var transporter = nodemailer.createTransport(sendMail(config.mailer.options));
			var mailOptions = {
				to: req.body.email_dlist,
				from: config.mailer.from,
				subject: 'IT Service Bulletin - ' + req.body.title + ' - ' +req.body.regions_affected + ' - Unplanned Outage (New)',	
				html: html
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
					}
				});
			}
		});
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
	var notice = req.notice;
	var reason;
	notice.updated_by = req.user.username;
	var count = notice.updates.length;
	// console.log('old updates array count is: ' + count);
	notice = _.extend(notice , req.body);
	// capture update number for subsequent email updates
	var new_count = ++count;


	if (req.body.status === 'closed') {
		reason = 'resolution';
	} else {
		reason = 'update';
	}

	notice.updates.push({number: new_count, reason: reason});

	notice.save(function(err, notice) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// console.log('new updates array count is: ' + count);
			var status_string, emailHtmlUpdate, emailTemplate;

			// if no error saving to DB, send email safely
			// we're using email-template here so gotta construct object
			emailTemplates(templatesDir, function(err, template) {

				  if (err) {
				    return res.status(500).send({
			        	message: errorHandler.getErrorMessage(err)
			        });
				  } else {

			// update email
			var emailHtml1 = {
				title: req.body.title,
				reason: req.body.notice_type,
				regions: req.body.regions_affected,
				outage_start_time: req.body.outage_start_time,
				services: req.body.services_affected,
				biz_impact: req.body.biz_impact,
				status_update: req.body.status_update,
				ticket_number: req.body.ticket_number
			};

			// resolution email
			var emailHtml2 = {
				title: req.body.title,
				reason: req.body.notice_type,
				regions: req.body.regions_affected,
				outage_start_time: req.body.outage_start_time,
				outage_end_time: req.body.outage_end_time,
				services: req.body.services_affected,
				biz_impact: req.body.biz_impact,
				status_update: req.body.status_update,
				ticket_number: req.body.ticket_number
			};

			// set notice content based on type
			// set default to update
			

			if (req.body.status === 'closed') {
				status_string = 'Resolved';
				emailHtmlUpdate = emailHtml2;
				emailTemplate = 'resolution-notice';
			} else {
				status_string = 'Update';
				emailHtmlUpdate = emailHtml1;
				emailTemplate = 'update-notice';
			}

			template(emailTemplate, emailHtmlUpdate, function(err, html, text) {
			      if (err) {
			        return res.status(500).send({
			        	message: errorHandler.getErrorMessage(err)
			        });
			      } else {

			
			var transporter = nodemailer.createTransport(sendMail(config.mailer.options));
			var mailOptions = {
				to: req.body.email_dlist,
				from: config.mailer.from,
				subject: 'IT Service Bulletin - ' + req.body.title + ' - ' +req.body.regions_affected + ' - Unplanned Outage ('+status_string+')', 	
				html: html
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
					}
				});
			}
		});
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

exports.listTemplates = function(req, res) {
	Template.find(function(err, templates) {
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
	Notice.findById(id).populate('created_by', 'username').exec(function(err, notice) {
		// console.log(JSON.stringify(notice, null, '\t'));
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





