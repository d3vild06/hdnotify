'use strict';

/**
 * Module dependencies.
 */
var timestamps = require('mongoose-timestamp'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Templates Schema
 */
var TemplateSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	regions_affected: {
		type: String,
		required: true
	},
	services_affected: {
		type: String,
		required: true
	},
	biz_impact: {
		type: String,
		required: true
	},
	email_dlist: {
		type: String,
		required: true
	},
	notices_created: [{
		type: String,
		ref: 'Notice'
	}],
	created_by: {
		type: String,
		ref: 'User'
	}
});

// mongoose plugin to auto-generate the createdAt and updatedAt property fields for this model
TemplateSchema.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

mongoose.model('Template', TemplateSchema);