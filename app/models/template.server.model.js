'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Templates Schema
 */
var TemplateSchema = new Schema({
	title: {
		type: String
	},
	regions_affected: {
		type: String
	},
	services_affected: {
		type: String
	},
	biz_impact: {
		type: String
	},
	workaround: {
		type: String
	},
	email_dlist: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	createdBy: {
		type: String
	}
});

mongoose.model('Template', TemplateSchema);