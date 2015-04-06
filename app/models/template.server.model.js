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
	notices_created: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Notice'
	}],
	created_by: {
		type: String
	}
});

// mongoose plugin to auto-generate the createdAt and updatedAt property fields for this model
TemplateSchema.plugin(timestamps, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

mongoose.model('Template', TemplateSchema);