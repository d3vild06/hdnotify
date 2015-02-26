'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Metric Schema
 */
var MetricSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Metric name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Metric', MetricSchema);