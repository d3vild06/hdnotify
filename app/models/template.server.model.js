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
	subject: {
		type: String,
		required: true
	},
	affected_regions: {
		type: String,
		required: true
	},
	impacted_services: {
		type: String,
		required: true
	},
	description: {
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